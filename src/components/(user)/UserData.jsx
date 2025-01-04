/* eslint-disable @next/next/no-img-element */
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Music, Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FriendButton from "@/components/(user)/FriendButton";

export default function UserData({ session, user, userId }) {
    const currentUserId = session?.user?.id;

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <img src={user.image === 'unknown' ? 'https://github.com/user-attachments/assets/bf57cb96-b259-4290-b35b-0ede9d618802' : user.image} alt={user.name} className="w-40 h-40 rounded-full object-cover" />
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold mb-4">{user.name}</h1>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {session?.user?.id === userId ? (
                        <>
                            <Button variant="outline" asChild><Link href="/my/charts" className="flex items-center gap-2"><Music className="w-4 h-4" />Charts</Link></Button>
                            <Button variant="outline" asChild><Link href="/my/account" className="flex items-center gap-2"><Settings className="w-4 h-4" />Settings</Link></Button>
                            <Button variant="destructive" onClick={() => signOut()} className="flex items-center gap-2"><LogOut className="w-4 h-4" />Sign Out</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" asChild><a href={`https://open.spotify.com/user/${userId}`} target="_blank" rel="noreferrer">Spotify Profile</a></Button>
                            {session && <FriendButton currentUserId={currentUserId} userId={userId} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}