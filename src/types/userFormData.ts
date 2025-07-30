import {User} from "@/types/user";

export type UserFormData = Omit<User, 'id'>;
