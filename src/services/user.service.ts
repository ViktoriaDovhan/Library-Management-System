import { users } from "../storage/data";
import { User } from "../types";
import { v4 as uuid } from "uuid";
import { CreateUserDto } from "../schemas/user.schema";

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
    users.find(u => u.id === id);

export const createUser = (data: CreateUserDto): User => {
    const user: User = {
        id: uuid(),
        name: data.name,
        email: data.email
    };
    users.push(user);
    return user;
};