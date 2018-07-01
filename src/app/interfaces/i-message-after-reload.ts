export interface IMessageAfterReload {
  type: 'error' | 'success',
  messages: string | string[],
  title: 'string'
}
