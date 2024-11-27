<template>
    {{ message }}
    <button v-on:click="setMessage">変更</button>
</template>
  
<script setup lang="ts">
import { useMessageStore } from '~/store/message';

const webrtcStore = useMessageStore();

const setMessage = () =>{
    console.log("test")
    webrtcStore.setMessage("テスト");
}

const message = computed(
    ():string =>{
        return webrtcStore.getMessage
    }
)
</script>
  