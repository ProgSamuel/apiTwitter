import { randomUUID } from "crypto"
import { Twitter } from "./twitter.model"
import { Follower } from "./follower.model"
import { Like } from "./like.model"
import { Reply } from "./reply.model"

export class User {
  idUser: string
  twitters: Twitter[] = []
  followers: Follower[] = []
  likes: Like[] = []
  replies: Reply[] = []
  dthrCreated: number
  dthrUpdate: Date
  token?: string
  constructor(
    public name: string,
    public email: string,
    public username: string,
    private password: string,

  ) {
    this.idUser = randomUUID(),
      this.dthrCreated = Date.now(),
      this.dthrUpdate = new Date()

  }

  toUserCreateInput() {
    return {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }
}
