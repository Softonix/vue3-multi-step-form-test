<template>
  <el-tabs
    :model-value="modelValue"
    :before-leave="beforeLeave"
    @tab-change="onTabChange"
  >
    <transition-group :name="transitionName" mode="out-in">
      <el-tab-pane
        v-for="(tab, index) in data"
        :key="`tab-${index}`"
        :disabled="disabled"
        :label="tab.label"
        :name="index"
      >
        <slot :tab="tab" :name="`tab-${index + 1}`" />
      </el-tab-pane>
    </transition-group>
  </el-tabs>
</template>

<script lang="ts" setup>
import { type ITab, ESlideAnimation, type TAwaitable } from '@/types'

const props = defineProps<{
  modelValue: number
  disabled?: boolean
  data: ITab[]
  beforeLeave?: (newName: string | number, oldName: string | number) => TAwaitable<boolean | void>
}>()

const emit = defineEmits(['update:modelValue', 'tab-change'])

const transitionName = ref(ESlideAnimation.RIGHT)

function onTabChange (tab: number | string) {
  transitionName.value = tab > props.modelValue ? ESlideAnimation.RIGHT : ESlideAnimation.LEFT
  emit('tab-change', tab)
}
</script>
