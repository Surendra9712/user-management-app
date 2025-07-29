import PaginatedTable from "@/app/(protected)/users/components/PaginatedTable";
import PageHeader from "@/app/(protected)/users/components/PageHeader";
import {UserDrawerProvider} from "@/app/(protected)/users/provider/UserDrawerProvider";
import AddEditUser from "@/app/(protected)/users/components/AddEditUser";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const UserList = () => {
    return (
        <ProtectedRoute>
        <UserDrawerProvider>
            <PageHeader/>
            <AddEditUser/>
            <PaginatedTable/>
        </UserDrawerProvider>
        </ProtectedRoute>
    );
};

export default UserList;