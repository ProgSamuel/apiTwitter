import express, { Request, Response } from "express";
import cors from 'cors';
import { UserController } from "./Controllers/user.controller";
import { TwitterController } from "./Controllers/twitter.controller";
import { checkId } from "./middlewares/checkId";
import { ReplyController } from "./Controllers/reply.controller";
import { LikeController } from "./Controllers/like.controller";

const app = express();
app.use(express.json());
app.use(cors());

const userController = new UserController()
const twitterController = new TwitterController()
const replyController = new ReplyController()
const likeController = new LikeController()

// USER
app.post('/createuser', userController.createUser) //  CRIAR USER
app.post('/user/login', userController.login) // LOGIN
// app.get('/user/:idUser', userController.searcheUser) // BUSCAR - TESTE 
app.put('/user/:idUser/updateUser', userController.updateUser) // ATUALIZAR
app.delete('/user/:idUser/delete', userController.deleteUser) // APAGAR

// TWITTER
app.get('/user/:idUser/home',twitterController.viewTwitters)
app.post('/user/:idUser/createtwitter',twitterController.createTwitter ) // CRIAR TT
app.put('/user/:idUser/updateTwitter/:idTwitter',twitterController.updateTwitter) // UPDATE TT
app.delete('/user/:idUser/deleteTwitter/:idTwitter', twitterController.deleteTwitter) // DELETE TT

// REPLY
app.post('/user/:idUser/reply/:idTwitter', replyController.replyTwitter) // CRIAR REPLY
app.put('/user/:idUser/updateReply/:idTwitter',replyController.updaterEPLY)// UPDATE REPLY
app.delete('/user/:idUser/deleteReply/:idTwitter',replyController.deleteReply)// DELETE REPLY

// LIKE
app.post('/user/:idUser/like/:twitterId', likeController.likeTwitter) // LIKE and DESLIKE in TT


app.listen(3335, () => {
    console.log("A API está rodando!");
});