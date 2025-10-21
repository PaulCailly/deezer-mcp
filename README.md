# Deezer Music Search - ChatGPT MCP Integration

A Next.js application that integrates the Deezer API through the Model Context Protocol (MCP), enabling music search functionality directly in ChatGPT with a beautiful results display.

## Overview

This project demonstrates how to build a music search application using the [OpenAI Apps SDK](https://developers.openai.com/apps-sdk) and Model Context Protocol (MCP). It connects to the Deezer API and displays search results in a modern, interactive widget inside ChatGPT.

## Features

- 🎵 **Music Search**: Search for tracks on Deezer using simple or advanced queries
- 🎨 **Modern UI**: Beautiful results display with album art, artist info, and audio previews
- 🎧 **Audio Previews**: Listen to 30-second track previews directly in the widget
- 🔍 **Advanced Filters**: Filter by artist, album, track, duration, BPM, and more
- 🌓 **Dark Mode**: Full dark mode support
- 📱 **Responsive**: Works great on all screen sizes

## Usage Examples

Once connected to ChatGPT, you can use natural language to search for music:

### Basic Search
- "Search for Eminem"
- "Find tracks by Coldplay"
- "Show me songs from Drake"

### Advanced Search
- "Find tracks by artist:\"Aloe Blacc\" track:\"i need a dollar\""
- "Search for songs with dur_min:300 bpm_max:140"
- "Find artist:\"The Beatles\" album:\"Abbey Road\""

### Advanced Search Filters

The Deezer API supports the following advanced filters:

| Filter | Description | Example |
|--------|-------------|---------|
| `artist:"name"` | Search by artist name | `artist:"coldplay"` |
| `album:"title"` | Search by album title | `album:"parachutes"` |
| `track:"name"` | Search by track name | `track:"yellow"` |
| `label:"name"` | Search by record label | `label:"parlophone"` |
| `dur_min:seconds` | Minimum duration | `dur_min:180` |
| `dur_max:seconds` | Maximum duration | `dur_max:300` |
| `bpm_min:value` | Minimum BPM | `bpm_min:120` |
| `bpm_max:value` | Maximum BPM | `bpm_max:140` |

You can combine multiple filters: `artist:"aloe blacc" track:"i need a dollar" dur_min:200`

## Key Components

### 1. MCP Server Route (`app/mcp/route.ts`)

The core MCP server that exposes the Deezer search tool to ChatGPT.

**Deezer Search Tool:**
- Accepts search queries with optional strict mode and sorting
- Supports both basic and advanced search syntax
- Returns structured data with track information, artist details, and album art
- Includes error handling for API failures

**Tool Configuration:**
```typescript
{
  query: string,           // Search query (basic or advanced)
  strict?: boolean,        // Disable fuzzy search
  order?: enum            // Sort order (RANKING, TRACK_ASC, etc.)
}
```

### 2. Widget UI (`app/page.tsx`)

The React component that displays search results in a beautiful, interactive format.

**Features:**
- Album artwork display with responsive layout
- Track information including title, artist, and album
- Duration formatting and explicit content badges
- Integrated audio player for 30-second previews
- Links to full tracks and artist pages on Deezer
- Empty state with helpful search examples
- Error handling and display
- Full dark mode support

## Getting Started

### Installation

```bash
pnpm install
# or
npm install
```

### Development

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app running locally.

### Testing the MCP Server

The MCP server is available at:
```
http://localhost:3000/mcp
```

You can test it using the MCP Inspector or by connecting it to ChatGPT.

### Connecting to ChatGPT

1. **Deploy to Vercel** (or your preferred hosting):
   ```bash
   vercel deploy
   ```

2. **Add to ChatGPT**:
   - Navigate to **Settings → [Connectors](https://chatgpt.com/#settings/Connectors) → Create**
   - Add your MCP server URL: `https://your-app.vercel.app/mcp`
   - Give it a name like "Deezer Music Search"

3. **Start Searching**:
   - In ChatGPT, ask to search for music: "Search for Eminem"
   - Results will appear in the beautiful widget!

**Note:** Connecting MCP servers to ChatGPT requires developer mode access. See the [connection guide](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt) for setup instructions.


## Project Structure

```
app/
├── mcp/
│   └── route.ts          # MCP server with Deezer search tool
├── hooks/                # React hooks for ChatGPT SDK integration
├── layout.tsx            # Root layout with SDK bootstrap
├── page.tsx              # Deezer search results UI
└── globals.css           # Global styles (Tailwind)
middleware.ts             # CORS handling for RSC
next.config.ts            # Asset prefix configuration
baseUrl.ts                # Base URL configuration for deployments
```

## How It Works

1. **User Query**: User asks ChatGPT to search for music (e.g., "Search for Eminem")
2. **Tool Invocation**: ChatGPT calls the `deezer_search` tool with the search query
3. **API Request**: The MCP server fetches results from the Deezer API
4. **Structured Response**: Results are returned as structured data with track information
5. **Widget Rendering**: ChatGPT renders the widget in an iframe showing the results
6. **Interactive UI**: Users can play previews, view album art, and click through to Deezer

## API Reference

### Deezer Search Tool

**Tool ID**: `deezer_search`

**Parameters**:
- `query` (string, required): Search query (basic or advanced with filters)
- `strict` (boolean, optional): Disable fuzzy search mode
- `order` (enum, optional): Sort order
  - `RANKING` (default)
  - `TRACK_ASC` / `TRACK_DESC`
  - `ARTIST_ASC` / `ARTIST_DESC`
  - `ALBUM_ASC` / `ALBUM_DESC`
  - `RATING_ASC` / `RATING_DESC`
  - `DURATION_ASC` / `DURATION_DESC`

**Returns**:
- `query`: The search query used
- `results`: Array of track objects with:
  - Track info (title, duration, explicit flag)
  - Artist details (name, links, pictures)
  - Album info (title, cover art)
  - Preview URL (30-second audio clip)
  - Deezer links
- `total`: Total number of results found

## Technology Stack

- **Framework**: Next.js 15.5 with App Router
- **Styling**: Tailwind CSS 4
- **MCP**: Model Context Protocol with `mcp-handler`
- **API**: Deezer Public API (no authentication required)
- **Deployment**: Vercel-ready with automatic environment detection

## Learn More

- [Deezer API Documentation](https://developers.deezer.com/api)
- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [OpenAI Apps SDK - MCP Server Guide](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Next.js Documentation](https://nextjs.org/docs)

## Deployment

This project is designed to work seamlessly with [Vercel](https://vercel.com) deployment:

```bash
vercel deploy
```

The `baseUrl.ts` configuration automatically detects Vercel environment variables and sets the correct asset URLs:
- Production URLs via `VERCEL_PROJECT_PRODUCTION_URL`
- Preview/branch URLs via `VERCEL_BRANCH_URL`
- Asset prefixing for correct resource loading in iframes

## License

MIT
