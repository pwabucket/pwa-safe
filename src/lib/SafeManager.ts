import { base64 } from "@scure/base";
import { randomBytes } from "@noble/ciphers/webcrypto";

import Encrypter, { type EncryptableData } from "./Encrypter";
import { uuid } from "./utils";
import localforage from "localforage";

type EncryptionResult = Awaited<ReturnType<typeof Encrypter.encryptData>>;

interface LocalForageEntry {
  encryptedContent: EncryptionResult;
  encryptedPassword: EncryptionResult;
}

export default class SafeManager {
  private store: LocalForage;
  constructor() {
    this.store = localforage.createInstance({
      name: "safe",
      storeName: "entries",
    });
  }

  generateEntryPassword() {
    return base64.encode(randomBytes(32));
  }

  async encrypt(password: string, data: EncryptableData) {
    const result = await Encrypter.encryptData({
      data,
      password,
      encode: false,
    });
    return result;
  }

  async decrypt(
    password: string,
    encryptedData: Uint8Array,
    salt: string,
    asText = false
  ) {
    return await Encrypter.decryptData({
      encrypted: encryptedData,
      password,
      salt,
      asText,
    });
  }

  async deleteEntry(id: string) {
    await this.store.removeItem(id);
  }

  async storeEntry(
    id: string,
    encryptedContent: EncryptionResult,
    encryptedPassword: EncryptionResult
  ) {
    return this.store.setItem(id, {
      encryptedContent,
      encryptedPassword,
    });
  }

  async getEntry(id: string) {
    const entry = await this.store.getItem<LocalForageEntry>(id);
    if (!entry) {
      throw new Error(`Entry with id ${id} not found`);
    }
    return entry;
  }

  async decryptEntry(id: string, accessCode: string) {
    const entry = await this.getEntry(id);
    const decryptedPassword = await this.decrypt(
      accessCode,
      entry.encryptedPassword.encrypted as Uint8Array,
      entry.encryptedPassword.salt,
      true
    );

    const decryptedContent = await this.decrypt(
      decryptedPassword as string,
      entry.encryptedContent.encrypted as Uint8Array,
      entry.encryptedContent.salt
    );

    return decryptedContent;
  }

  async createEntry(accessCode: string, content: EncryptableData) {
    const id = uuid();
    const entryPassword = this.generateEntryPassword();
    const encryptedContent = await this.encrypt(entryPassword, content);
    const encryptedPassword = await this.encrypt(accessCode, entryPassword);

    await this.storeEntry(id, encryptedPassword, encryptedContent);

    return {
      id,
    };
  }
}
