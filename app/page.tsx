"use client";

import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
} from "./hooks";

interface DeezerTrack {
  id: number;
  title: string;
  title_short: string;
  title_version?: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  preview: string;
  artist: {
    id: number;
    name: string;
    link: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
  };
}

interface DeezerSearchResult {
  query?: string;
  results?: DeezerTrack[];
  total?: number;
  error?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Home() {
  const toolOutput = useWidgetProps<{
    result?: { structuredContent?: DeezerSearchResult };
  }>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const searchData = toolOutput?.result?.structuredContent;
  const hasResults = searchData?.results && searchData.results.length > 0;
  const hasError = searchData?.error;

  return (
    <div
      className="font-sans w-full"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
        overflow: displayMode === "fullscreen" ? "auto" : undefined,
      }}
    >
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="fixed top-4 right-4 z-50 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => requestDisplayMode("fullscreen")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8 text-orange-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.7 7.2c-.9-.9-2.1-1.4-3.4-1.4-2.6 0-4.8 2.1-4.8 4.8 0 1.3.5 2.5 1.4 3.4.9.9 2.1 1.4 3.4 1.4 2.6 0 4.8-2.1 4.8-4.8 0-1.3-.5-2.5-1.4-3.4zm-3.4 6.2c-1.6 0-2.9-1.3-2.9-2.9s1.3-2.9 2.9-2.9 2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9z" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
            </svg>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Deezer Music Search
            </h1>
          </div>
          {!isChatGptApp && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 text-sm text-blue-900 dark:text-blue-100">
              This widget displays search results from the Deezer API via MCP.
              Use ChatGPT to search for music!
            </div>
          )}
        </div>

        {/* Search Info */}
        {searchData?.query && (
          <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Search query:
                </span>
                <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                  {searchData.query}
                </span>
              </div>
              {searchData.total !== undefined && (
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {searchData.total.toLocaleString()} results found
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
            <p className="text-sm text-red-900 dark:text-red-100">
              <strong>Error:</strong> {searchData.error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!hasResults && !hasError && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No search results yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Ask ChatGPT to search for music on Deezer!
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
              Examples: &quot;Search for Eminem&quot;, &quot;Find tracks by Aloe
              Blacc&quot;
            </p>
          </div>
        )}

        {/* Results Grid */}
        {hasResults && (
          <div className="grid gap-4">
            {searchData.results!.map((track) => (
              <div
                key={track.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  {/* Album Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={track.album.cover_medium}
                      alt={track.album.title}
                      className="w-24 h-24 rounded-md object-cover"
                    />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                          {track.title}
                          {track.explicit_lyrics && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                              E
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 truncate">
                          {track.artist.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 truncate">
                          {track.album.title}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatDuration(track.duration)}
                        </p>
                      </div>
                    </div>

                    {/* Audio Preview */}
                    {track.preview && (
                      <div className="mt-3">
                        <audio
                          controls
                          className="w-full h-8"
                          preload="none"
                          style={{ maxWidth: "400px" }}
                        >
                          <source src={track.preview} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {/* Links */}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <a
                        href={track.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        Listen on Deezer
                      </a>
                      <a
                        href={track.artist.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        View Artist
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {hasResults && searchData.results!.length < (searchData.total ?? 0) && (
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {searchData.results!.length} of {searchData.total} results
          </div>
        )}
      </div>
    </div>
  );
}
