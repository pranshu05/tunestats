const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

export const getNowPlaying = async (accessToken) => {
    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export default async function getNowPlayingItem(accessToken) {
    const response = await getNowPlaying(accessToken);
    if (response.status === 204 || response.status > 400) {
        return false;
    }

    const song = await response.json();
    const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
    const isPlaying = song.is_playing;
    const songUrl = song.item.external_urls.spotify;
    const title = song.item.name;
    const albumImageUrl = song.item.album.images[0].url;
    const albumName = song.item.album.name;
    const progressMs = song.progress_ms;
    const durationMs = song.item.duration_ms;

    return { artist, isPlaying, songUrl, title, albumImageUrl, progressMs, durationMs, albumName };
}