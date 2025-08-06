export type Entry = {
  id: string;
  title: string;
  type: "text" | "image" | "file";
  createdAt?: number;
  updatedAt?: number;
  filename?: string; // Optional for text and image entries
  filetype?: string; // Optional for text and image entries
};

export interface EntryFormData {
  title: string;
  type: Entry["type"];
  content: string | File | Blob;
}
