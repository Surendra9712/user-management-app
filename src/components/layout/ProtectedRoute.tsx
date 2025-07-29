"use client"
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {useEffect} from 'react';
import {Flex} from "antd";

export default function ProtectedRoute({children}: { children: React.ReactNode }) {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <Flex justify={'center'} align={'center'} className="min-h-[calc(100vh-128px)]">
                <p>Loading...</p>
            </Flex>
        );
    }

    if (session) {
        return <>{children}</>;
    }

    return null;
}