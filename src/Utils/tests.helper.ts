import { randomUUID } from "crypto"

export const idUserTest = randomUUID()
export const idFollowTest = randomUUID()
export const idTweetTest = randomUUID()

export const authorizationTokenTest = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhNjkwOTgxLWI5YWEtNDY1NS1iZjEyLTM3M2RjYmJjMGNjYiIsInVzZXJuYW1lIjoidXNlcmRhdmlzIiwiZW1haWwiOiJkYXZpczMwM0BleGFtcGxlLmNvbSIsImlhdCI6MTcxMDQ1MTIzNSwiZXhwIjoxNzEwNDU0ODM1fQ.dpb90pcPSKcxe-I2r144-YzCQxXKoUcaaAuVu51_tE4"

export const userLoginTest = {
    email: "email1",
    password: "username1",
}
export const userLoginUsernameTest = {
    username: "username",
    password: "username1",
}
export const userTest = {
    idUser: idUserTest,
    email: "email1",
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    name: "name1",
    password: "username1",
    photo: "photo1",
    token: authorizationTokenTest,
    username: "username1"
}
export const userTest2 = {
    idUser: idFollowTest,
    email: "email2",
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    name: "name2",
    password: "username2",
    photo: "photo2",
    token: authorizationTokenTest,
    username: "username2"
}

export const typeTest = {
    normal: "normal",
    reply: "reply"
}

export const tweetTest = {
    idTwitter: idTweetTest,
    content: 'content',
    type: typeTest.normal,
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    idUser: 'idusertest'
}

export const replyTest = {
    idTwitter:idTweetTest,
    type: typeTest.reply,
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    userId: idUserTest,
    twitterOrigin: "tweetOrigin",
    replyContent: "replyContent"
}
export const exitingLikeReply = {
    idUser: idUserTest,
    idLike: randomUUID(),
    replyId: replyTest.idTwitter,
    dthrCreated: new Date(),
    dthrUpdated: new Date(),
    twitterId: idTweetTest
}

export const likeReplyTweetTest = {
    idUser: idUserTest,
    dthrUpdated: new Date(),
    replyId: randomUUID()
}

export const createUserTest = {
    name: "nameTeste",
    email: "emailTeste",
    username: "username1",
    password: "passwordTeste"
}

export const contentTest = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."

export const homeTest = {
    idUser: 'idUserTest',
    content: 'contentTest',
    idTwitter: 'tweetTest',
    user: 'userTest',
    dthrUpdated: new Date(),
    likes: [],
    replies: []
};

