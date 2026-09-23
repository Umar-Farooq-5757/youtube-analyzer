export type YouTubeInputType = "video" | "playlist" | "channel" | "unknown";

export interface ParsedYouTubeUrl {
  type: YouTubeInputType;
  id: string | null;
}

export function parseYouTubeUrl(input: string): ParsedYouTubeUrl {
  const url = input.trim();
  const playlistMatch = url.match(/[?&]list=([^#&?]+)/);
  if (playlistMatch && playlistMatch[1]) {
    return { type: "playlist", id: playlistMatch[1] };
  }
  const videoMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  if (videoMatch && videoMatch[1]) {
    return { type: "video", id: videoMatch[1] };
  }
  const handleMatch = url.match(/(?:youtube\.com\/@|@)([\w.-]+)/);
  if (handleMatch && handleMatch[1]) {
    return { type: "channel", id: `@${handleMatch[1]}` };
  }
  const channelMatch = url.match(/youtube\.com\/channel\/([\w-]{24})/);
  if (channelMatch && channelMatch[1]) {
    return { type: "channel", id: channelMatch[1] };
  }
  if (/^[\w-]{11}$/.test(url)) return { type: "video", id: url };
  if (/^PL[\w-]{16,32}$/.test(url)) return { type: "playlist", id: url };
  if (/^UC[\w-]{22}$/.test(url)) return { type: "channel", id: url };

  return { type: "unknown", id: null };
}
