import {User} from "@/interface/user";

export type UserFormData = Omit<User, 'id'>;
