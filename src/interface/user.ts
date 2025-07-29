import {UserStatusEnum} from "@/enum/userStatus.enum";
import {GenderEnum} from "@/enum/gender.enum";

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: number;
    gender: GenderEnum;
    joinDate: string;
    role: string;
    status: UserStatusEnum;
    address: string;
}