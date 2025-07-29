import { authOptions } from '@/lib/authOptions';
import { getServerSession as getSession} from 'next-auth';

export const getServerSession = async () => {
    return await getSession(authOptions);
};