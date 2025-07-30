import ProtectedRoute from '@/components/layout/ProtectedRoute';
import UserAnalytics from "@/app/(protected)/dashboard/components/UserAnalytics";
export const metadata = {
    title: 'Dashboard',
};
const Dashboard = () => {
    return (
        <ProtectedRoute>
            <UserAnalytics/>
        </ProtectedRoute>
    );
};

export default Dashboard;