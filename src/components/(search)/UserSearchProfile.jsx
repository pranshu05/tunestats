/* eslint-disable @next/next/no-img-element */
export default function UserSearchProfile({ user }) {
    return (
        <div className="flex flex-col items-center bg-[#121212] p-3 rounded-lg gap-2">
            <img src={user.image === 'unknown' ? 'https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802' : user.image} alt={user.name} className="w-32 h-32 rounded-full object-cover" />
            <h3 className="text-xl font-bold">{user.name}</h3>
            <a href={`/user/${user.spotifyId}`} className="px-4 py-2 bg-[#121212] border-[2px] border-[#333] rounded-md">View Profile</a>
        </div>
    );
}