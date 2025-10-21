import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

// Deezer API Types
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

interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
}

async function searchDeezer(
  query: string,
  strict?: boolean,
  order?: string
): Promise<DeezerSearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (strict) params.append("strict", "on");
  if (order) params.append("order", order);

  const response = await fetch(`https://api.deezer.com/search?${params}`);
  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.statusText}`);
  }

  return await response.json();
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const deezerWidget: ContentWidget = {
    id: "deezer_search",
    title: "Deezer Search",
    templateUri: "ui://widget/deezer-template.html",
    invoking: "Searching Deezer...",
    invoked: "Search completed",
    html: html,
    description: "Search for tracks on Deezer",
    widgetDomain: "https://www.deezer.com",
  };

  server.registerResource(
    "deezer-widget",
    deezerWidget.templateUri,
    {
      title: deezerWidget.title,
      description: deezerWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": deezerWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${deezerWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": deezerWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": deezerWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
    deezerWidget.id,
    {
      title: deezerWidget.title,
      description:
        "Search for music tracks on Deezer. Supports basic search (e.g., 'eminem') and advanced search with filters (e.g., 'artist:\"aloe blacc\" track:\"i need a dollar\"'). You can filter by artist, album, track, label, duration (dur_min, dur_max), and BPM (bpm_min, bpm_max).",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query. Can be a simple text search or advanced search with filters like artist:"name" album:"title" track:"song" dur_min:300 bpm_max:200'
          ),
        strict: z
          .boolean()
          .optional()
          .describe("Disable fuzzy search mode for exact matches"),
        order: z
          .enum([
            "RANKING",
            "TRACK_ASC",
            "TRACK_DESC",
            "ARTIST_ASC",
            "ARTIST_DESC",
            "ALBUM_ASC",
            "ALBUM_DESC",
            "RATING_ASC",
            "RATING_DESC",
            "DURATION_ASC",
            "DURATION_DESC",
          ])
          .optional()
          .describe("Sort order for results"),
      },
      _meta: widgetMeta(deezerWidget),
    },
    async ({ query, strict, order }) => {
      try {
        const results = await searchDeezer(query, strict, order);

        return {
          content: [
            {
              type: "text",
              text: `Found ${results.total} tracks for "${query}"`,
            },
          ],
          structuredContent: {
            query,
            strict,
            order,
            results: results.data,
            total: results.total,
            timestamp: new Date().toISOString(),
          },
          _meta: widgetMeta(deezerWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error searching Deezer: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          structuredContent: {
            query,
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
          _meta: widgetMeta(deezerWidget),
        };
      }
    }
  );
});

export const GET = handler;
export const POST = handler;
