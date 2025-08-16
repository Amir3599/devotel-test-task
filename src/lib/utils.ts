import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateOptimisticId = (zerosCount = 0): number => {
  const id = Math.floor(100000 + Math.random() * 900000);
  return id * Math.pow(10, zerosCount);
}


export const isOptimisticId = (id: number) => id.toString().endsWith("00")
