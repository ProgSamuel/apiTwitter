export class Follower {
    dthrCreated: number
    dthrUpdate: Date
    constructor(public userId:string){
        this.dthrCreated = Date.now(),
        this.dthrUpdate = new Date()
    }
}