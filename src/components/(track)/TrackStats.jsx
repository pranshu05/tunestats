export default function TrackStats({ track }) {
    return (
        <div className="p-4 rounded-lg bg-zinc-900/50">
            <div className="flex flex-col h-full justify-center items-center space-y-4">
                <h1 className="text-2xl font-bold">Track Info</h1>
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{track.trackPopularity}%</h1>
                    <p className="text-xl">Popularity</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                    <h1 className="text-3xl text-[#1DB954] font-bold">{Math.floor(track.trackDuration / 60000)}:{((track.trackDuration % 60000) / 1000).toFixed(0).padStart(2, '0')}</h1>
                    <p className="text-xl">Duration</p>
                </div>
            </div>
        </div>
    )
}