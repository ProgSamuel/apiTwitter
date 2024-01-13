export class Reply {
    dthrCreated: number
    dthrUpdate: Date
    userId: string | undefined

    constructor(public idUser: string, public idTwitter: string, public content: string, public type: string) {
        this.dthrCreated = Date.now(),
            this.dthrUpdate = new Date()
    }

}