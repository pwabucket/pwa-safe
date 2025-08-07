import { base64 } from "@scure/base";
import { randomBytes } from "@noble/ciphers/webcrypto";

import Encrypter, { type EncryptableData } from "./Encrypter";
import { uuid } from "./utils";
import localforage from "localforage";

type EncryptionResult = Awaited<ReturnType<typeof Encrypter.encryptData>>;

interface LocalForageEntry {
  encryptedContent: EncryptionResult;
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
    encryptedContent,
  }: {
    id: string;
    encryptedKey: EncryptionResult;
    encryptedContent: EncryptionResult;
  }) {
    await this.store.setItem(`${id}:key`, encryptedKey);
    await this.store.setItem(`${id}:data`, encryptedContent);
  }

  async getEntry(id: string) {
    const encryptedKey = await this.store.getItem<EncryptionResult>(
      `${id}:key`
    );
    const encryptedContent = await this.store.getItem<EncryptionResult>(
      `${id}:data`
    );

    if (!encryptedKey || !encryptedContent) {
      throw new Error(`Entry with id ${id} not found`);
    }

    return {
      encryptedKey,
      encryptedContent,
    } as LocalForageEntry;
  }

  async getEntryContent({
    entry,
    accessCode,
  }: {
    entry: LocalForageEntry;
    accessCode: string;
  }) {
    const decryptedPassword = await this.decrypt({
      password: accessCode,
      encryptedData: entry.encryptedKey.encrypted as Uint8Array,
      salt: entry.encryptedKey.salt,
      asText: true,
    });

    const decryptedContent = await this.decrypt({
      password: decryptedPassword as string,
      encryptedData: entry.encryptedContent.encrypted as Uint8Array,
      salt: entry.encryptedContent.salt,
    });

    return decryptedContent as Uint8Array;
  }

  async decryptEntry({ id, accessCode }: { id: string; accessCode: string }) {
    const entry = await this.getEntry(id);

    return await this.getEntryContent({
      entry,
      accessCode,
    });
  }

  async createEntry({
    accessCode,
    content,
  }: {
    accessCode: string;
    content: EncryptableData;
  }) {
    const id = uuid();
    const entryKey = this.generateEntryKey();

    const encryptedContent = await this.encrypt({
      data: content,
      password: entryKey,
    });

    const encryptedKey = await this.encrypt({
      data: entryKey,
      password: accessCode,
    });

    await this.storeEntry({ id, encryptedKey, encryptedContent });

    return {
      id,
    };
  }
}
