import { PaginatedData } from "./data";
import { Media } from "./media";

export interface User {
    id?:number,
    users_permissions_user: number,
    name:string,
    surname:string,
    username?:string,
    picture?:Media|null,
}

export type PaginatedUsers = PaginatedData<User>;