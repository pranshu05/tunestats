/* eslint-disable @next/next/no-img-element */
import { User } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UserSearchProfile({ user }) {
    return (
        <Card className="overflow-hidden p-4">
            <CardContent>
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        {user.image && user.image !== 'unknown' ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                                <User className="w-1/2 h-1/2 text-zinc-400" />
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-4">{user.name}</h3>
                    <Button asChild className="w-full">
                        <Link href={`/user/${user.spotifyId}`}>View Profile</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 