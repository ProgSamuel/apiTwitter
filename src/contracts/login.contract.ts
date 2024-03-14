import { JwtPayload } from "jsonwebtoken";

export interface PayloadToken extends JwtPayload { 
    id: string; 
    username: string;
    email:string;
    }