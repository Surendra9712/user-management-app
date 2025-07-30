import PaginatedTable from "@/app/(protected)/users/components/PaginatedTable";
import UserPageHeader from "@/app/(protected)/users/components/UserPageHeader";
import {UserDrawerProvider} from "@/app/(protected)/users/provider/UserDrawerProvider";
import AddEditUser from "@/app/(protected)/users/components/AddEditUser";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const UserList = () => {
    return (
        <ProtectedRoute>
            <UserDrawerProvider>
                <UserPageHeader/>
                <AddEditUser/>
                <PaginatedTable/>
            </UserDrawerProvider>
        </ProtectedRoute>
    );
};

export default UserList;