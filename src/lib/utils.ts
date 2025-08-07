import clsx, { type ClassValue } from "clsx";
import JSZip from "jszip";
import { twMerge } from "tailwind-merge";
import type { EncryptionResult } from "./Encrypter";
import type { EncryptedMetadata } from "../types/entry";

export const createMetadata = (
  type: "text" | "image" | "file",
  content: string | File | Blob
): EncryptedMetadata => {
  const metadata: EncryptedMetadata = { type };

  if (content instanceof File) {
    metadata.filename = content.name;
    metadata.filetype = content.type;
    metadata.filesize = content.size;
    metadata.fileLastModified = content.lastModified;
  }

  return metadata;
};

export const zipAndDownloadBundle = ({
  filename,
  metadata,
  encryptedKey,
  encryptedData,
}: {
  filename: string;
  metadata: EncryptedMetadata;
  encryptedKey: EncryptionResult;
  encryptedData: EncryptionResult;
}) => {
  const zip = new JSZip();

  /** Metadata file */
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  /** Encrypted key files */
  zip.file("key.salt", encryptedKey.salt);
  zip.file("key.enc", encryptedKey.encrypted as Uint8Array);

  /** Encrypted data files */
  zip.file("data.salt", encryptedData.salt);
  zip.file("data.enc", encryptedData.encrypted as Uint8Array);

  zip.generateAsync({ type: "blob" }).then((content) => {
    downloadFile(content, `bundle-${filename}.zip`);
  });
};

export const zipAndDownloadEncryptedResult = (
  filename: string,
  encryptionResult: EncryptionResult
) => {
  const zip = new JSZip();

  zip.file("data.salt", encryptionResult.salt);
  zip.file("data.enc", encryptionResult.encrypted as Uint8Array);
  zip.generateAsync({ type: "blob" }).then((content) => {
    downloadFile(content, `${filename}.zip`);
  });
};

export const downloadFile = (content: Blob | File, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = filename;
  link.click();
};

export const extractZipFile = async (file: File) => {
  const zip = new JSZip();
  const content = await file.arrayBuffer();
  const unzipped = await zip.loadAsync(content);
  const files = Object.keys(unzipped.files);

  const saltFile = files.find((f) => f === ".salt");
  const encryptedFile = files.find((f) => f === ".enc");

  return Promise.all([
    unzipped.files[saltFile!].async("string"),
    unzipped.files[encryptedFile!].async("uint8array"),
  ]).then(([salt, encrypted]) => {
    return { salt, encrypted };
  });
};

export const extractZipBundle = async (file: File) => {
  const zip = new JSZip();
  const content = await file.arrayBuffer();
  const unzipped = await zip.loadAsync(content);

  return Promise.all([
    unzipped.files["metadata.json"]
      .async("string")
      .then((data) => JSON.parse(data)),
    unzipped.files["key.salt"].async("string"),
    unzipped.files["key.enc"].async("uint8array"),
    unzipped.files["data.salt"].async("string"),
    unzipped.files["data.enc"].async("uint8array"),
  ]).then(([metadata, keySalt, keyEncrypted, dataSalt, dataEncrypted]) => {
    return {
      metadata: metadata as EncryptedMetadata,
      encryptedKey: { salt: keySalt, encrypted: keyEncrypted },
      encryptedData: { salt: dataSalt, encrypted: dataEncrypted },
    };
  });
};

export { v4 as uuid } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function searchProperties<T extends Record<string, unknown>>(
  list: Array<T>,
  search: string,
  properties: (keyof T)[]
) {
  return list.filter((item) =>
    properties.some(
      (property) =>
        typeof item[property] === "string" &&
        item[property]?.toLowerCase().includes(search.toLowerCase())
    )
  );
}
