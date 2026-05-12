const API_KEY = "AIzaSyDtNDvvF1616vFmswRUNYZ6rmdsJqpn0e8";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const searchVideos = async (query, maxResults = 3) => {
  try {
    const response = await fetch(`${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=${maxResults}`);
    const data = await response.json();
    if (data.items) {
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};



