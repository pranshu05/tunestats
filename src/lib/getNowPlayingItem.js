export default async function getNowPlayingItem(userID) {
    const response = await fetch(`/api/spotify?userID=${userID}`);
    if (response.status === 204 || response.status > 400) {
        return { isPlaying: false };
    }

    const song = await response.json();
    return {
        artist: song.item.artists.map((_artist) => _artist.name).join(", "),
        isPlaying: song.is_playing,
        songUrl: song.item.external_urls.spotify,
        title: song.item.name,
        albumImageUrl: song.item.album.images[0].url,
        progressMs: song.progress_ms,
        durationMs: song.item.duration_ms,
        albumName: song.item.album.name,
    };
}