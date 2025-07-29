import ProtectedRoute from '@/components/layout/ProtectedRoute';
import UserAnalytics from "@/app/(protected)/dashboard/components/UserAnalytics";

const Dashboard = () => {
    return (
        <ProtectedRoute>
            <UserAnalytics/>
        </ProtectedRoute>
    );
};

export default Dashboard;