import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { SpotifyPlayer } from '@/components/SpotifyPlayer';

const UserPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { clientId } = router.query;

    useEffect(() => {
        if (status === 'loading') return; 
        if (!session) router.push('/');
    }, [session, status]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>Redirecting...</p>;
    }

    return (
        <div className='flex h-screen justify-center items-center flex-col'>
            <h1>User Information</h1>
            <p>Client ID: {clientId}</p>
            <p className='text-green-500'>Name: {session.user.name}</p>
            <p className='text-green-400'>Email: {session.user.email}</p>
            {session.user.image && <img src={session.user.image} alt={session.user.name} />}
            <SpotifyPlayer accessToken={session.accessToken} />
        </div>
    );
};

export default UserPage;    