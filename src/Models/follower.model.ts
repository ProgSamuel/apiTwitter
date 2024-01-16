export class Follower {
    dthrCreated: number
    dthrUpdate: Date
    constructor(public userId:string, public followId:string){
        this.dthrCreated = Date.now(),
        this.dthrUpdate = new Date()
    }
}