import type { FormItemRule, FormInstance } from 'element-plus'

interface IFormField {
  rules?: FormItemRule | FormItemRule[]
  label: string
}

export function useElForm<T extends string> (form: Record<T, IFormField>) {
  const { rules, ...rest } = Object.entries<IFormField>(form).reduce((acc, [key, formField]) => {
    acc.rules[key as T] = formField.rules
    acc.config[key as T] = { label: formField.label, prop: key }
    return acc
  }, {
    rules: {},
    config: {}
  } as {
    rules: Record<T, IFormField['rules']>
    config: Record<T, { label: string; prop: string }>
  })

  return {
    ref: ref<FormInstance>(),
    rules,
    ...rest.config
  }
}

// ------------------------------------------- F O R M  R U L E S ------------------------------------------------------
export function useRequiredRule ({ required = true } = {}) {
  return { required, message: 'This field is required', trigger: 'change' } as FormItemRule
}

export function useEmailRule () {
  return { type: 'email', message: 'Invalid email', trigger: ['change', 'blur'] } as FormItemRule
}

export function useMinLenRule (min: number): FormItemRule {
  return { min, message: `Min length is ${min}`, trigger: 'change' } as FormItemRule
}

export function useMaxLenRule (max: number): FormItemRule {
  return { max, message: `Max length is ${max}`, trigger: 'change' } as FormItemRule
}
