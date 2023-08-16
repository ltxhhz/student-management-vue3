<template>
  <n-config-provider :theme="lightMode ? lightTheme : darkTheme">
    <!-- <n-dialog-provider> -->
    <n-message-provider>
      <content v-model:theme-mode="themeMode1" />
    </n-message-provider>
    <!-- </n-dialog-provider> -->
  </n-config-provider>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider, lightTheme, darkTheme } from 'naive-ui'
import { ref, watch } from 'vue';
import content from './components/content.vue'

export type ThemeMode = 'auto' | 'light' | 'dark'
const themeMode1 = ref<ThemeMode>('auto')
const mm = window.matchMedia('(prefers-color-scheme: light)')
const lightMode = ref(mm.matches)

mm.addEventListener('change', (ev) => {
  if (themeMode1.value == 'auto') {
    lightMode.value = ev.matches
  }
})

themeMode1.value = (<ThemeMode | null>localStorage.getItem('themeMode') || (localStorage.setItem('themeMode', 'auto'), 'auto'))
lightMode.value = themeMode1.value == 'light'
console.log("🚀 ~ file: App.vue:37 ~ chrome.storage.local.get ~ themeMode:", themeMode1)
watch(() => themeMode1.value, v => {
  console.log('change', v);

  if (v == 'auto') {
    lightMode.value = mm.matches
  } else {
    lightMode.value = themeMode1.value == 'light'
  }
  localStorage.setItem('themeMode', v)
})
</script>

<style scoped></style>
