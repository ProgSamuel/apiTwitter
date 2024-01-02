import { randomUUID } from "crypto"
import { Like } from "./like.model"
import { Reply } from "./reply.model"

export class Twitter {
    idTwitter: string
    dthrCreated: number
    dthrUpdate: Date
    likes: Like[] = []
    replies: Reply[] = []


    constructor(
        public content: string,
        public type: string,
        public idUser: string
    ) {
        this.idTwitter = randomUUID()
        this.dthrCreated = Date.now(),
            this.dthrUpdate = new Date()
    }
}