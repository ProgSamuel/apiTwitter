import { publicDecrypt } from "crypto";

export class Like {
    constructor(
        public userId: string,
        public twitterId: string) {

    }
}