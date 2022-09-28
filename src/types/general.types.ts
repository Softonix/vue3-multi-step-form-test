export enum ESlideAnimation {
  LEFT = 'slide-left',
  RIGHT = 'slide-right'
}

export interface ITab {
  label: string
}

export type TArrayable<T> = T | T[]
export type TAwaitable<T> = Promise<T> | T
