import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserFirstLetters(str: string) {
  if (!str.includes(" ")) {
    return str.slice(0, 2).toUpperCase();
  }

  const firstLetters = str
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

  return firstLetters.slice(0, 2).toUpperCase();
}

export function downloadFileFromUrl(url: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 200);
}
