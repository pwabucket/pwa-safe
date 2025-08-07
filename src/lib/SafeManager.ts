import { base64 } from "@scure/base";
import { randomBytes } from "@noble/ciphers/webcrypto";

import Encrypter, {
  type EncryptableData,
  type EncryptionResult,
} from "./Encrypter";
import { uuid } from "./utils";
import localforage from "localforage";

export interface EncryptedData {
  encryptedData: EncryptionResult;
  encryptedKey: EncryptionResult;
}

export default class SafeManager {
  private store: LocalForage;
  constructor() {
    this.store = localforage.createInstance({
      name: "safe",
      storeName: "entries",
    });
  }

  generateEntryKey() {
    return base64.encode(randomBytes(32));
  }

  async encrypt({
    data,
    password,
  }: {
    data: EncryptableData;
    password: string;
  }) {
    const result = await Encrypter.encryptData({
      data,
      password,
      encode: false,
    });

    return result;
  }

  async decrypt({
    password,
    encryptedData,
    salt,
    asText = false,
  }: {
    password: string;
    encryptedData: Uint8Array | string;
    salt: string;
    asText?: boolean;
  }) {
    return await Encrypter.decryptData({
      encrypted: encryptedData,
      password,
      salt,
      asText,
    });
  }

  async deleteEntry(id: string) {
    await this.store.removeItem(`${id}:key`);
    await this.store.removeItem(`${id}:data`);
  }

  async storeEntry({
    id,
    encryptedKey,
    encryptedData,
  }: {
    id: string;
    encryptedKey: EncryptionResult;
    encryptedData: EncryptionResult;
  }) {
    await this.store.setItem(`${id}:key`, encryptedKey);
    await this.store.setItem(`${id}:data`, encryptedData);
  }

  async getEncryptedKey(id: string) {
    return await this.store.getItem<EncryptionResult>(`${id}:key`);
  }

  async getEncryptedData(id: string) {
    return await this.store.getItem<EncryptionResult>(`${id}:data`);
  }

  async getEntry(id: string) {
    const encryptedKey = await this.getEncryptedKey(id);
    const encryptedData = await this.getEncryptedData(id);

    if (!encryptedKey || !encryptedData) {
      throw new Error(`Entry with id ${id} not found`);
    }

    return {
      encryptedKey,
      encryptedData,
    } as EncryptedData;
  }

  async decryptContent({
    accessCode,
    encryptedKey,
    encryptedData,
  }: {
    accessCode: string;
    encryptedKey: EncryptionResult;
    encryptedData: EncryptionResult;
  }) {
    const decryptedPassword = await this.decrypt({
      password: accessCode,
      encryptedData: encryptedKey.encrypted as Uint8Array,
      salt: encryptedKey.salt,
      asText: true,
    });

    const decryptedContent = await this.decrypt({
      password: decryptedPassword as string,
      encryptedData: encryptedData.encrypted as Uint8Array,
      salt: encryptedData.salt,
    });

    return decryptedContent as Uint8Array;
  }

  async getEntryContent({
    entry,
    accessCode,
  }: {
    entry: EncryptedData;
    accessCode: string;
  }) {
    return this.decryptContent({
      accessCode,
      encryptedKey: entry.encryptedKey,
      encryptedData: entry.encryptedData,
    });
  }

  async decryptEntry({ id, accessCode }: { id: string; accessCode: string }) {
    const entry = await this.getEntry(id);

    return await this.getEntryContent({
      entry,
      accessCode,
    });
  }

  async createEncryption({
    accessCode,
    content,
  }: {
    accessCode: string;
    content: EncryptableData;
  }) {
    const entryKey = this.generateEntryKey();
    const encryptedData = await this.encrypt({
      data: content,
      password: entryKey,
    });

    const encryptedKey = await this.encrypt({
      data: entryKey,
      password: accessCode,
    });

    return {
      encryptedKey,
      encryptedData,
    };
  }

  async createEntry({
    accessCode,
    content,
  }: {
    accessCode: string;
    content: EncryptableData;
  }) {
    const id = uuid();
    const { encryptedKey, encryptedData } = await this.createEncryption({
      accessCode,
      content,
    });

    await this.storeEntry({ id, encryptedKey, encryptedData });

    return {
      id,
    };
  }

  async clearEntries() {
    await this.store.clear();
  }
}
