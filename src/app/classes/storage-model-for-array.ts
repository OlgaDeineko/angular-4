import { StorageModel } from './storage-model';
import { IMessageAfterReload } from '../interfaces/i-message-after-reload';

export class StorageModelForArray extends StorageModel {
  protected _prepareData(data: IMessageAfterReload | IMessageAfterReload[]): string {
    let oldData: IMessageAfterReload[] = this.data || [];
    let result: string;

    if (typeof data === 'undefined') {
      return;
    }

    if (!Array.isArray(data)) {
      data = [data]
    }

    oldData = [...oldData, ...data];

    if (typeof data === 'object') {
      result = JSON.stringify(oldData);
    }
    return result;
  }
}
