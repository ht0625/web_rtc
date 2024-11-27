import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => ({
    message: "aaa",
  }),
  getters: {
    getMessage: (state) => {
      return state.message;
    }
  },
  actions: {
    // メッセージの状態を更新するアクション
    setMessage(message: string) {
      this.message = message;
    }
  },
});
