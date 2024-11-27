import { defineStore } from 'pinia';

export const useWebRTCStore = defineStore('webrtc', {
  state: () => ({
    // offerConnection: null as RTCPeerConnection | null,
    // answerConnection: null as RTCPeerConnection | null,
    offerSendChannel: null as RTCDataChannel | null,
    answerSendChannel: null as RTCDataChannel | null,
    offerReceiveChannel: null as RTCDataChannel | null,
    answerReceiveChannel: null as RTCDataChannel | null,
    // messages: [] as string[],
  }),

  actions: {
    // RTCPeerConnectionの設定
    // setOfferConnection(connection: RTCPeerConnection) {
    //   this.offerConnection = connection;
    // },
    // setAnswerConnection(connection: RTCPeerConnection) {
    //   this.answerConnection = connection;
    // },

    // DataChannelの設定
    setOfferSendChannel(channel: RTCDataChannel) {
      this.offerSendChannel = channel;
    },
    setAnswerSendChannel(channel: RTCDataChannel) {
      this.answerSendChannel = channel;
    },
    setOfferReceiveChannel(channel: RTCDataChannel) {
      this.offerReceiveChannel = channel;
    },
    setAnswerReceiveChannel(channel: RTCDataChannel) {
      this.answerReceiveChannel = channel;
    },

    // メッセージの追加
    // addMessage(message: string) {
    //   this.messages.push(message);
    // },

    // ICE候補の追加
    // async addIceCandidatesOffer(candidateStrings: string[]) {
    //   if (!this.answerConnection) return;
    //   for (const candidateStr of candidateStrings) {
    //     const candidate = JSON.parse(candidateStr);
    //     try {
    //       await this.answerConnection.addIceCandidate(candidate);
    //       console.log('オファーのICE候補が追加されました:', candidate);
    //     } catch (err) {
    //       console.error('オファーのICE候補追加エラー:', err);
    //     }
    //   }
    // },

    // async addIceCandidatesAnswer(candidateStrings: string[]) {
    //   if (!this.offerConnection) return;
    //   for (const candidateStr of candidateStrings) {
    //     const candidate = JSON.parse(candidateStr);
    //     try {
    //       await this.offerConnection.addIceCandidate(candidate);
    //       console.log('アンサーのICE候補が追加されました:', candidate);
    //     } catch (err) {
    //       console.error('アンサーのICE候補追加エラー:', err);
    //     }
    //   }
    // },
  },
});
