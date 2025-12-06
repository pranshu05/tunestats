import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export async function requireAuth(): Promise<| { authenticated: true; userId: string } | { authenticated: false; response: NextResponse }> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
            authenticated: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return {
        authenticated: true,
        userId: session.user.id,
    };
}

export function isAuthorized(userId: string, resourceOwnerId: string): boolean {
    return userId === resourceOwnerId;
}