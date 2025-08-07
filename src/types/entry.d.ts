export type Entry = {
  id: string;
  title: string;
  type: "text" | "image" | "file";
  createdAt: number;
  updatedAt: number;
  filename?: string; // Optional for text
  filetype?: string; // Optional for text
  filesize?: number; // Optional for text
  fileLastModified?: number; // Optional for text
};

export interface EntryFormData {
  title: string;
  type: Entry["type"];
  content: string | File | Blob;
}
