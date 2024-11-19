<template>
  <div>
    <h2>ブラウザ間でのデータ送信</h2>

    <!-- オファー側SDPの表示領域 -->
    <textarea v-model="offerSDP" placeholder="ここにオファー側SDPを生成または貼り付け"></textarea>
    <button @click="createOffer">オファーSDP作成</button>
    <button @click="setOffer">オファーSDP設定</button>

    <!-- アンサー側SDPの表示領域 -->
    <textarea v-model="answerSDP" placeholder="ここにアンサー側SDPを生成または貼り付け"></textarea>
    <button @click="createAnswer">アンサーSDP作成</button>
    <button @click="setAnswer">アンサーSDP設定</button>

    <!-- オファー側ICE候補の表示領域 -->
    <h3>オファー側のICE候補</h3>
    <textarea v-model="offerIceCandidates" placeholder="ここにオファー側のICE候補を貼り付け"></textarea>
    <button @click="addIceCandidatesOffer">オファーのICE候補設定</button>

    <!-- アンサー側ICE候補の表示領域 -->
    <h3>アンサー側のICE候補</h3>
    <textarea v-model="answerIceCandidates" placeholder="ここにアンサー側のICE候補を貼り付け"></textarea>
    <button @click="addIceCandidatesAnswer">アンサー側のICE候補設定</button>

    <!-- データ送信用のUI -->
    <input v-model="message" type="text" placeholder="送信するメッセージ" />
    <button @click="sendMessageOffer">オファー側からアンサー側へメッセージ送信</button>
    <button @click="sendMessageAnswer">アンサー側からオファー側へメッセージ送信</button>

    <!-- 受信メッセージ表示領域 -->
    <div>
      <p v-for="(msg, index) in messages" :key="index">{{ msg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 変数定義
const offerSDP = ref('');
const answerSDP = ref('');
const offerIceCandidates = ref('');
const answerIceCandidates = ref('');
const message = ref('');
const messages = ref<string[]>([]);

let offerConnection: RTCPeerConnection | null = null;
let answerConnection: RTCPeerConnection | null = null;
let offerSendChannel: RTCDataChannel | null = null;
let answerSendChannel: RTCDataChannel | null = null;
let offerReceiveChannel: RTCDataChannel | null = null;
let answerReceiveChannel: RTCDataChannel | null = null;

// メッセージ表示関数
const displayMessage = (msg: string) => {
  messages.value.push(msg);
};

// オファーSDP作成
const createOffer = async () => {
  offerConnection = new RTCPeerConnection();

  offerSendChannel = offerConnection.createDataChannel('offerSendChannel');
  offerSendChannel.onopen = () => console.log('オファー側データチャンネルがオープンしました');
  offerSendChannel.onclose = () => console.log('オファー側データチャンネルがクローズしました');

  offerConnection.ondatachannel = (event) => {
    offerReceiveChannel = event.channel;
    offerReceiveChannel.onmessage = (e) => displayMessage(`受信: ${e.data}`);
  };

  const offer = await offerConnection.createOffer();
  await offerConnection.setLocalDescription(offer);
  offerSDP.value = JSON.stringify(offer);

  offerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('オファー側 ICE候補:', event.candidate);
      offerIceCandidates.value += JSON.stringify(event.candidate) + '\n';
    }
  };
};

// オファーSDP設定
const setOffer = async () => {
  if (!offerSDP.value) return;
  const offer = JSON.parse(offerSDP.value);
  answerConnection = new RTCPeerConnection();

  answerConnection.ondatachannel = (event) => {
    answerReceiveChannel = event.channel;
    answerReceiveChannel.onmessage = (e) => displayMessage(`受信: ${e.data}`);
  };

  await answerConnection.setRemoteDescription(offer);
  console.log('オファーが設定されました。');
};

// アンサーSDP作成
const createAnswer = async () => {
  if (!answerConnection) return;
  const answer = await answerConnection.createAnswer();
  await answerConnection.setLocalDescription(answer);
  answerSDP.value = JSON.stringify(answer);

  answerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('アンサー側 ICE候補:', event.candidate);
      answerIceCandidates.value += JSON.stringify(event.candidate) + '\n';
    }
  };

  answerSendChannel = answerConnection.createDataChannel('answerSendChannel');
  answerSendChannel.onopen = () => console.log('アンサー側データチャンネルがオープンしました');
  answerSendChannel.onclose = () => console.log('アンサー側データチャンネルがクローズしました');
};

// アンサーSDP設定
const setAnswer = async () => {
  if (!offerConnection || !answerSDP.value) return;
  const answer = JSON.parse(answerSDP.value);
  await offerConnection.setRemoteDescription(answer);
  console.log('アンサーが設定されました。接続が確立されました。');
};

// ICE候補設定
const addIceCandidatesOffer = () => {
  if (!answerConnection || !offerIceCandidates.value) return;
  const candidates = offerIceCandidates.value.trim().split('\n');
  candidates.forEach((candidateStr) => {
    const candidate = JSON.parse(candidateStr);
    if(answerConnection != null){
      answerConnection.addIceCandidate(candidate).catch((err) => console.error('ICE候補追加エラー:', err));
    }
  });
};

const addIceCandidatesAnswer = () => {
  if (!offerConnection || !answerIceCandidates.value) return;
  const candidates = answerIceCandidates.value.trim().split('\n');
  candidates.forEach((candidateStr) => {
    const candidate = JSON.parse(candidateStr);
    if(offerConnection != null){
      offerConnection.addIceCandidate(candidate).catch((err) => console.error('ICE候補追加エラー:', err));
    }
  });
};

// メッセージ送信
const sendMessageOffer = () => {
  if (offerSendChannel && offerSendChannel.readyState === 'open') {
    offerSendChannel.send(message.value);
    displayMessage(`送信: ${message.value}`);
    message.value = '';
  }
};

const sendMessageAnswer = () => {
  if (answerSendChannel && answerSendChannel.readyState === 'open') {
    answerSendChannel.send(message.value);
    displayMessage(`送信: ${message.value}`);
    message.value = '';
  }
};
</script>
