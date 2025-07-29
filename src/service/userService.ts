import { User } from '@/interface/user';
import {UserFormData} from "@/types/userFormData";

export class UserService {
    private users: User[];

    constructor(initialUsers: User[] = []) {
        this.users = [...initialUsers];
    }

    fetchUsers = async (): Promise<User[]> => {
        return Promise.resolve(this.users);
    };

    getUserById = async (id: number): Promise<User | undefined> => {
        const user = this.users.find(u => u.id === id);
        return Promise.resolve(user);
    };

    createUser = async (user: UserFormData): Promise<User> => {
        const newUser: User = {
            ...user,
            id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1
        };
        this.users.push(newUser);
        return Promise.resolve(newUser);
    };

    updateUser = async (id: number, updated: Partial<User>): Promise<void> => {
        this.users = this.users.map(u => (u.id === id ? { ...u, ...updated } : u));
        return Promise.resolve();
    };

    deleteUser = async (id: number): Promise<void> => {
        this.users = this.users.filter(u => u.id !== id);
        return Promise.resolve();
    };
}
