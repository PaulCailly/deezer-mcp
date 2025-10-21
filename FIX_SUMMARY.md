# UI Re-rendering Fix Summary

## Problem

The UI was not re-rendering after receiving results from the Deezer MCP tool. This was caused by React's `useSyncExternalStore` not detecting changes when the `window.openai.toolOutput` object was mutated in place rather than being replaced with a new reference.

## Root Cause

React uses `Object.is()` comparison to detect changes in `useSyncExternalStore`. If ChatGPT updates `window.openai.toolOutput` by mutating the existing object instead of creating a new one, React won't detect the change and won't trigger a re-render.

## Solution

Modified `/Users/pcailly/deezer-mcp/app/hooks/use-openai-global.ts` to:

1. **Deep clone values on event**: When the `openai:set_globals` event fires, the new value is deep cloned to create a completely new object reference
2. **Cache cloned snapshots**: The cloned value is cached in a Map, ensuring each event results in a new reference
3. **Return cached snapshots**: The `getSnapshot` function returns the cached clone instead of the original object from `window.openai`

This ensures that every time the event fires, React receives a new object reference and triggers a re-render.

## Changes Made

### 1. `/app/hooks/use-openai-global.ts`

- Added `deepClone()` function to create deep copies of objects
- Added `globalSnapshots` Map to cache cloned values
- Modified event handler to deep clone and cache values when events fire
- Modified `getSnapshot` to return cached clones instead of direct window.openai references
- Added debug logging to track event firing and value caching

### 2. `/app/page.tsx`

- Added React import
- Added global event listener in useEffect to debug event firing
- Enhanced console logging with timestamps

## Testing Instructions

1. **Start the dev server**:

   ```bash
   npm run dev
   ```

2. **Open the app in ChatGPT**:

   - Navigate to the app URL
   - Open browser DevTools console

3. **Trigger a search**:

   - Ask ChatGPT to search for music (e.g., "Search for Eminem on Deezer")
   - Watch the console for debug logs

4. **Expected Console Output**:

   ```
   [Page] Component rendered at: [timestamp]
   [Page] Global SET_GLOBALS event detected: {...}
   [useOpenAIGlobal] Event received for key: toolOutput
   [useOpenAIGlobal] Cached new snapshot for key: toolOutput
   [Page] Component rendered at: [new timestamp]
   ```

5. **Verify UI Updates**:
   - The search results should appear in the UI immediately
   - The debug panel should show the correct query and results count
   - Track cards should display with album art, artist info, etc.

## Debug Panel

The UI includes a debug panel (yellow section at the top) that shows:

- Whether toolOutput exists
- Whether toolOutput.result exists
- Whether searchData exists
- The search query
- Results count
- Full JSON of toolOutput

## Cleanup (Optional)

Once confirmed working, you can:

1. Remove the debug console.log statements from `use-openai-global.ts`
2. Remove the global event listener from `page.tsx`
3. Remove or hide the debug panel in the UI

## Technical Details

### Deep Clone Implementation

The `deepClone()` function handles:

- Primitive values (strings, numbers, booleans)
- Dates
- Arrays (recursively)
- Plain objects (recursively)
- Null values

### Cache Strategy

- Snapshots are cached per global key (e.g., "toolOutput")
- Each event creates a new snapshot with a new object reference
- Initial load (before first event) returns value directly from window.openai
- Once an event fires, all subsequent calls return the cached clone

### Event Handling

The fix preserves the original event handling logic:

- Only triggers onChange when the specific key exists in event.detail.globals
- Maintains passive event listeners for performance
- Properly cleans up event listeners on unmount
