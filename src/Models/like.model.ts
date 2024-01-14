import { randomUUID } from "crypto"

export class Like {
    idLike: string
    dthrCreated: number
    dthrUpdate: Date
    constructor(
        public userId: string,
        public twitterId: string
        ) {
        this.idLike = randomUUID()
        this.dthrCreated = Date.now(),
        this.dthrUpdate = new Date()
    }
}