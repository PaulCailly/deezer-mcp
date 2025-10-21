# Deezer Music Search - Usage Examples

## Quick Start

Once you've connected your MCP server to ChatGPT, you can start searching for music using natural language.

## Basic Searches

### Simple Artist Search

```
You: "Search for Eminem"
ChatGPT: [Calls deezer_search tool with query: "eminem"]
Widget: Displays top Eminem tracks with album art and previews
```

### Album Search

```
You: "Find tracks from the album Parachutes by Coldplay"
ChatGPT: [Calls deezer_search with query: 'album:"parachutes" artist:"coldplay"']
Widget: Shows tracks from the Parachutes album
```

### Genre/Mood Search

```
You: "Show me some upbeat songs"
ChatGPT: [Calls deezer_search with appropriate query and bpm_min filter]
Widget: Displays high-energy tracks
```

## Advanced Searches

### Duration Filtering

```
You: "Find songs between 3 and 4 minutes long"
ChatGPT: [Calls deezer_search with query: "dur_min:180 dur_max:240"]
Widget: Shows tracks within that duration range
```

### BPM Filtering (for DJs and Workouts)

```
You: "Find workout music with 120-140 BPM"
ChatGPT: [Calls deezer_search with query: "bpm_min:120 bpm_max:140"]
Widget: Displays high-tempo tracks perfect for exercise
```

### Specific Track

```
You: "Find 'I Need a Dollar' by Aloe Blacc"
ChatGPT: [Calls deezer_search with query: 'artist:"aloe blacc" track:"i need a dollar"']
Widget: Shows the specific track with preview
```

### Label Search

```
You: "What music does Columbia Records have?"
ChatGPT: [Calls deezer_search with query: 'label:"columbia"']
Widget: Shows tracks from Columbia Records
```

## Combined Filters

### Artist + Duration

```
You: "Find longer songs by The Beatles (over 5 minutes)"
ChatGPT: [Calls deezer_search with query: 'artist:"the beatles" dur_min:300']
Widget: Shows Beatles tracks longer than 5 minutes
```

### Album + Track + Duration

```
You: "Find 'Bohemian Rhapsody' from A Night at the Opera, show only if it's over 5 minutes"
ChatGPT: [Calls deezer_search with query: 'artist:"queen" album:"a night at the opera" track:"bohemian rhapsody" dur_min:300']
Widget: Shows the epic 6-minute version
```

### BPM + Duration (DJ Mixing)

```
You: "Find 4-5 minute tracks with 128 BPM for my DJ set"
ChatGPT: [Calls deezer_search with query: "dur_min:240 dur_max:300 bpm_min:128 bpm_max:128"]
Widget: Perfect tracks for mixing
```

## Sorting Results

### By Track Name

```
You: "Search for Radiohead songs and sort alphabetically by title"
ChatGPT: [Calls deezer_search with query: "radiohead", order: "TRACK_ASC"]
Widget: Shows Radiohead tracks sorted A-Z
```

### By Duration

```
You: "Find Pink Floyd songs, longest first"
ChatGPT: [Calls deezer_search with query: "pink floyd", order: "DURATION_DESC"]
Widget: Shows their epic long tracks first
```

### By Popularity

```
You: "Show me the most popular Beyoncé tracks"
ChatGPT: [Calls deezer_search with query: "beyonce", order: "RANKING"]
Widget: Shows hits sorted by popularity
```

## Strict Mode

### Exact Match

```
You: "Find exact matches for 'The' (artist or band literally named 'The')"
ChatGPT: [Calls deezer_search with query: "the", strict: true]
Widget: Shows only exact matches, no fuzzy results
```

## Widget Features

Once results are displayed, you can:

1. **View Album Art**: High-quality album covers for each track
2. **See Track Info**: Title, artist name, album name, duration
3. **Play Previews**: Click play on the audio player to hear 30-second clips
4. **Open in Deezer**: Click "Listen on Deezer" to open the full track
5. **View Artist**: Click "View Artist" to see the artist's Deezer page
6. **Identify Explicit Content**: Tracks with explicit lyrics show an "E" badge

## Tips for Best Results

1. **Use quotes for exact phrases**: `artist:"aloe blacc"` vs `artist:aloe blacc`
2. **Combine multiple filters**: More filters = more specific results
3. **Use natural language**: ChatGPT will translate your intent into proper queries
4. **Browse with sorting**: Use order parameters to discover music differently
5. **Check durations for DJs**: Use dur_min/dur_max for sets and playlists

## Error Handling

If a search fails, the widget will show:

- Clear error message
- Suggestion to try a different query
- The original search query for reference

## Examples by Use Case

### For DJs

- "Find 128 BPM house tracks between 5-7 minutes"
- "Show me tracks by Daft Punk around 120 BPM"

### For Workouts

- "High BPM songs for running (140+ BPM)"
- "Upbeat tracks between 3-4 minutes"

### For Discovery

- "Show me albums by Radiohead sorted by rating"
- "Find tracks from Blue Note Records"

### For Playlists

- "Find chill songs under 100 BPM"
- "Show me tracks from the album Dark Side of the Moon"

Enjoy discovering music with the Deezer MCP integration! 🎵
