export type EncryptedMetadata = {
  type: "text" | "image" | "file";
  filename?: string; // Optional for text
  filetype?: string; // Optional for text
  filesize?: number; // Optional for text
  fileLastModified?: number; // Optional for text
};

export type Entry = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
} & EncryptedMetadata;

export interface EntryFormData {
  title?: string;
  type: Entry["type"];
  content: string | File | Blob | null;
}

export interface EntryUpdateFormData {
  title: string;
}
