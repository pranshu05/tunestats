import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const UserPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { clientId } = router.query;

    useEffect(() => {
        if (status === 'loading') return; // Do nothing while loading
        if (!session) router.push('/'); // Redirect to home if not authenticated
    }, [session, status]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>Redirecting...</p>;
    }

    return (
        <div>
            <h1>User Information</h1>
            <p>Client ID: {clientId}</p>
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            {session.user.image && <img src={session.user.image} alt={session.user.name} />}
        </div>
    );
};

export default UserPage;