export interface UserCreatedDTO {
    name: string, 
    email: string, 
    username: string, 
    password: string
}

export interface UserUpdateDTO{
    idUser:string, 
    name?:string, 
    email?:string, 
    username?:string, 
    password?:string
}