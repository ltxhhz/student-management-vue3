<template>
  <div style="min-height: 22px;" @click="handleOnClick">
    <template v-if="isEdit">
      <n-input v-if="(typeof inputValue === 'string')" ref="inputRef" v-model:value="inputValue" @blur="handleOnChange" autosize/>
      <n-input-number v-else-if="(typeof inputValue === 'number')" ref="inputRef" v-model:value="inputValue"
        @blur="handleOnChange" />
    </template>
    <template v-else>{{ value }}</template>
  </div>
</template>
<script setup lang="ts" generic="T extends string|number">
import { nextTick, ref, computed } from "vue";
import { NInput, NInputNumber } from "naive-ui";
const props = defineProps<{
  value: T
}>()

const emits = defineEmits<{
  (e: 'update:value', v: T): void
}>()
const isEdit = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = computed<T>({
  get() {
    return props.value
  },
  set(v) {
    emits('update:value', v)
  }
})

function handleOnClick() {
  isEdit.value = true
  nextTick(() => {
    inputRef.value!.focus()
  })
}

function handleOnChange() {
  isEdit.value = false
}

</script>
<style lang="less"></style>