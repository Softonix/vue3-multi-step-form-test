<template>
  <el-card v-loading="loading">
    <el-form
      :ref="formConfig.ref"
      :model="formModel"
      :rules="formConfig.rules"
      label-position="top"
    >
      <Tabs
        v-model="currentTabIndex"
        class="min-h-[220px]"
        :disabled="tabsDisabled"
        :before-leave="changeTab"
        :data="tabs"
      >
        <!-- FIRST NAME & LAST NAME -->
        <template #tab-1>
          <el-form-item
            :label="formConfig.firstName.label"
            :prop="formConfig.firstName.prop"
          >
            <el-input v-model="formModel.firstName" />
          </el-form-item>

          <el-form-item
            :label="formConfig.lastName.label"
            :prop="formConfig.lastName.prop"
          >
            <el-input v-model="formModel.lastName" />
          </el-form-item>
        </template>

        <!-- MIDDLE NAME -->
        <template #tab-2>
          <el-form-item
            :label="formConfig.middleName.label"
            :prop="formConfig.middleName.prop"
          >
            <el-input v-model="formModel.middleName" />
          </el-form-item>
        </template>

        <!-- DATE OF BIRTH -->
        <template #tab-3>
          <el-form-item
            :label="formConfig.dateOfBirth.label"
            :prop="formConfig.dateOfBirth.prop"
          >
            <el-date-picker
              v-model="formModel.dateOfBirth"
              placeholder="Pick a date"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
        </template>

        <!-- RESULTS -->
        <template #tab-4>
          <el-descriptions border direction="vertical" :column="4">
            <el-descriptions-item
              v-for="(value, key) in formModel"
              :key="key"
              :label="formConfig[key].label"
            >
              <p>{{ value || 'N/A' }}</p>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </Tabs>

      <div class="mt-2">
        <el-button
          v-if="currentTabIndex < tabs.length - 1"
          :disabled="currentTabIndex === 0"
          @click="changeTab(currentTabIndex - 1)"
        >
          Previous
        </el-button>

        <el-button @click="changeTab(currentTabIndex + 1)">
          {{ currentTab.buttonText }}
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { ITab, TAwaitable } from '@/types'

const loading = ref(false)

const currentTabIndex = ref(0)
const currentTab = computed(() => tabs[currentTabIndex.value])
const tabsDisabled = computed(() => currentTabIndex.value === tabs.length - 1)

const tabs: (ITab & {
  buttonText: string
  action?: () => TAwaitable<boolean | void>
})[] = ([
  {
    label: 'First Name & Last Name',
    buttonText: 'Next',
    action: () => {
      return formConfig.ref.value?.validateField([
        formConfig.firstName.prop,
        formConfig.lastName.prop
      ])
    }
  },
  { label: 'Middle Name', buttonText: 'Next' },
  {
    label: 'Date Of Birth',
    buttonText: 'Submit',
    action: async () => {
      await formConfig.ref.value?.validateField(formConfig.dateOfBirth.prop)
      await submit()
    }
  },
  {
    label: 'Results',
    buttonText: 'Reset',
    action: () => {
      setTimeout(() => {
        formConfig.ref.value?.resetFields()
        changeTab(0)
      }, 0)
    }
  }
])

async function changeTab (newIndex: number | string) {
  if (newIndex > currentTabIndex.value) {
    await currentTab.value.action?.()
    currentTabIndex.value = Math.min(+newIndex, tabs.length - 1)
  } else {
    currentTabIndex.value = +newIndex
  }
}

const formModel = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: ''
})

const formConfig = useElForm<keyof typeof formModel>({
  firstName: { label: 'First Name', rules: useRequiredRule() },
  lastName: { label: 'Last Name', rules: useRequiredRule() },
  middleName: { label: 'Middle Name' },
  dateOfBirth: { label: 'Date of birth', rules: useRequiredRule() }
})

async function submit () {
  try {
    loading.value = true
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, 600)
    })

    ElMessage.success('The form has been successfully submitted!')
  } finally {
    loading.value = false
  }
}
</script>
