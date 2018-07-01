import { Injectable } from '@angular/core';
import { StorageModel } from '../classes/storage-model';
import { StorageModelForArray } from '../classes/storage-model-for-array';

@Injectable()
export class SessionService {
  previousPage: StorageModel = new StorageModel('previous_page', 'session');
  kbSettings: StorageModel = new StorageModel('kb_settings');
  token: StorageModel = new StorageModel('access_token');
  subdomain: StorageModel = new StorageModel('subdomain');
  algoliaIndex: StorageModel = new StorageModel('algoliaIndex');
  kbRout: StorageModel = new StorageModel('kb_rout', 'session');
  messagesAfterReload: StorageModelForArray = new StorageModelForArray('messagesAfterReload', 'session');
  registrData: StorageModel = new StorageModel('registration', 'session');
  registrDataStep: StorageModel = new StorageModel('step', 'session');
  fileStructure: StorageModel = new StorageModel('file_structure', 'session');
  visitorLang: StorageModel = new StorageModel('visitorLang');
  systemLang: StorageModel = new StorageModel('systemLang');
}
