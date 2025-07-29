import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {User} from '@/interface/user';
import {userService} from "@/service";

export const useUsers = () => {
    const queryClient = useQueryClient();

    const query = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: userService.fetchUsers,
    });

    const create = useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
    });

    const update = useMutation({
        mutationFn: ({id, updated}: { id: number; updated: Partial<User> }) =>
            userService.updateUser(id, updated),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
    });

    const remove = useMutation({
        mutationFn: (id: number) => userService.deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['users']}),
    });

    return {
        ...query,
        createUser: create.mutateAsync,
        createUserLoading: create.isPending,

        updateUser: update.mutateAsync,
        updateUserLoading: update.isPending,

        deleteUser: remove.mutateAsync,
        deleteUserLoading: remove.isPending,
    };
};
