export class StorageModel {
  protected _key: string;
  protected _storage: Storage;
  protected _storageType: string;

  constructor(key: string, storage: string = 'local') {
    this._key = key;
    this._storageType = storage;
    this._storage = (storage === 'local') ? window.localStorage : window.sessionStorage;
  }

  get data(): any {
    this._checkExpiry();
    let data = this._storage.getItem(this._key);
    try {
      data = JSON.parse(data);
    } catch (e) {
    }

    return data;
  }

  set data(data: any) {
    if (typeof data === 'undefined') {
      return;
    }
    this._storage.setItem(this._key, this._prepareData(data));
  }

  protected _prepareData(data: any): string {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    return data
  }

  /**
   * setExpiry
   * @param {number} expiryTime - expiry time in seconds
   */
  setExpiry(expiryTime: number): void {
    let now = new Date().getTime();
    if (this._storageType === 'local') {
      this._storage.setItem(`${this._key}_expiry`, (now + expiryTime * 1000).toString())
    }
  }

  protected _checkExpiry() {
    if (this._storageType === 'local') {
      return;
    }
    let expiry = this._storage.getItem(`${this._key}_expiry`);
    if (typeof expiry === 'undefined' || expiry === null) {
      return;
    }

    let now = new Date().getTime();
    if (now > +expiry) {
      this.remove();
    }
  }

  remove(): void {
    this._storage.removeItem(this._key);
    this._storage.removeItem(`${this._key}_expiry`);
  }
}
