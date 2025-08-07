import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
