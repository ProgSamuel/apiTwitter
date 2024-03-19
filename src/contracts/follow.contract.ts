interface UserFollow{
    username:string | null,
    idUser: string | null,
    following: Following[] | null
}

interface Following {
    id: string;
    idUser: string;
    idFollowing: string;
    dthrCreated: Date;
    dthrUpdated: Date;
}

export interface DataFollowDTO{
    idUser: string,
    idFollow:string, 
    user:UserFollow | null, 
    userFollow:UserFollow | null,
    existingId?:string
}