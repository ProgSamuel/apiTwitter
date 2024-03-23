export interface LikeDTO{
    idUser:string, 
    twitterId:string , 
    username:string|null
}

export interface UnLikeDTO{
    idUser:string, 
    twitterId:string, 
    idLike:string |null
}