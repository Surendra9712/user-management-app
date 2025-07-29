import {UserService} from "@/service/userService";
import userData from "../data/users.json"
export const userService = new UserService(userData);