<template>
    <!-- データ送信用のUI -->
    <input v-model="message" type="text" placeholder="送信するメッセージ" />
    <button @click="sendMessageOffer">オファー側からアンサー側へメッセージ送信</button>
    <button @click="sendMessageAnswer">アンサー側からオファー側へメッセージ送信</button>

    <!-- 受信メッセージ表示領域 -->
    <div>
      <p v-for="(msg, index) in messages" :key="index">{{ msg }}</p>
    </div>
</template>
  
<script setup lang="ts">
import { useWebRTCStore } from '~/store/webrtc';

const webrtcStore = useWebRTCStore();
const message = ref('');
const messages = ref<string[]>([]);

const sendMessageOffer = () => {
  if (webrtcStore.offerSendChannel && webrtcStore.offerSendChannel.readyState === 'open') {
    const sendData = JSON.stringify({ type:'url', data:message.value });
    webrtcStore.offerSendChannel.send(sendData);
    displayMessage(`送信: ${message.value}`);
    message.value = '';
  }else{
    console.log("データ送信できませんでした")
    console.log(webrtcStore.offerSendChannel)
    console.log(webrtcStore.offerSendChannel?.readyState)
    console.log(message.value)
  }
};

const sendMessageAnswer = () => {
  if (webrtcStore.answerSendChannel && webrtcStore.answerSendChannel.readyState === 'open') {
    const sendData = JSON.stringify({ type:'url', data:message.value });
    webrtcStore.answerSendChannel.send(sendData);
    displayMessage(`送信: ${message.value}`);
    message.value = '';
  }else{
    console.log("データ送信できませんでした")
    console.log(webrtcStore.answerSendChannel)
    console.log(webrtcStore.answerSendChannel?.readyState)
    console.log(message.value)
  }
};

watch(
  () => webrtcStore.offerReceiveChannel,
  (channel) => {
    if (channel) {
    //   channel.onmessage = (e) => displayMessage(`受信: ${e.data}`);
      channel.onmessage = (e) => {
        const receivedData = JSON.parse(e.data);
        console.log(receivedData)
        displayMessage(`受信: ${receivedData.data}`)
      };
      console.log('受信チャンネルが設定されました');
    }
  },
  { immediate: true }
);

watch(
  () => webrtcStore.answerSendChannel,
  (channel) => {
    if (channel) {
    //   channel.onmessage = (e) => displayMessage(`受信: ${e.data}`);
    channel.onmessage = (e) => {
        const receivedData = JSON.parse(e.data);
        console.log(receivedData)
        displayMessage(`受信: ${receivedData.data}`)
      };
      console.log('受信チャンネルが設定されました');
    }
  },
  { immediate: true }
);

// メッセージ表示関数
const displayMessage = (msg: string) => {
  messages.value.push(msg);
};
</script>