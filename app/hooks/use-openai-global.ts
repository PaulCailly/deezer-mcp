/**
 * Source: https://github.com/openai/openai-apps-sdk-examples/tree/main/src
 */

import { useSyncExternalStore } from "react";
import {
  SET_GLOBALS_EVENT_TYPE,
  SetGlobalsEvent,
  type OpenAIGlobals,
} from "./types";

// Cache snapshots of global values to ensure referential stability
const globalSnapshots = new Map<keyof OpenAIGlobals, unknown>();

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Low-level hook to subscribe to a specific OpenAI global value.
 * Uses React's useSyncExternalStore for efficient reactivity.
 * 
 * @param key - The key of the OpenAI global to subscribe to
 * @returns The current value of the global or null if not available
 * 
 * @example
 * ```tsx
 * const theme = useOpenAIGlobal("theme"); // "light" | "dark" | null
 * ```
 */
export function useOpenAIGlobal<K extends keyof OpenAIGlobals>(
  key: K
): OpenAIGlobals[K] | null {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handleSetGlobal = (event: SetGlobalsEvent) => {
        console.log(`[useOpenAIGlobal] Event received for key: ${String(key)}`, event.detail.globals);
        
        const value = event.detail.globals[key];
        if (value === undefined) {
          console.log(`[useOpenAIGlobal] Value is undefined for key: ${String(key)}, skipping`);
          return;
        }

        // Create a deep clone and cache it to ensure a new reference
        // This forces React to detect the change even if the object is mutated
        const clonedValue = deepClone(value);
        globalSnapshots.set(key, clonedValue);
        
        console.log(`[useOpenAIGlobal] Cached new snapshot for key: ${String(key)}`);

        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => {
      if (typeof window === "undefined") return null;
      
      // Return the cached snapshot if available
      // This ensures we return a new reference each time the event fires
      if (globalSnapshots.has(key)) {
        return globalSnapshots.get(key) as OpenAIGlobals[K];
      }
      
      // For the initial load or if event hasn't fired yet, return from window
      return window.openai?.[key] ?? null;
    },
    () => null
  );
}
