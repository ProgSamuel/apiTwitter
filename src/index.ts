import express, { Request, Response } from "express";
import cors from 'cors';
import { UserController } from "./Controllers/user.controller";
import { TwitterController } from "./Controllers/twitter.controller";
import { checkId } from "./middlewares/checkId";
import { ReplyController } from "./Controllers/reply.controller";

const app = express();
app.use(express.json());
app.use(cors());

const userController = new UserController()
const twitterController = new TwitterController()
const replyController = new ReplyController()

// USER
app.post('/createuser', userController.createUser) //  CRIAR USER
app.post('/user/login', userController.login) // LOGIN
// app.get('/user/:idUser', userController.searcheUser) // BUSCAR - TESTE 
app.put('/user/:idUser/updateUser', checkId, userController.updateUser) // ATUALIZAR
app.delete('/user/:idUser/delete', checkId, userController.deleteUser) // APAGAR

// TWITTER
app.get('/user/:idUser/home',twitterController.viewTwitters)
app.post('/user/:idUser/createtwitter', checkId,twitterController.createTwitter ) // CRIAR TT
// app.post('/user/like/:idUser', checkId,twitterController.likeTwitter ) // LKE EM TT
app.put('/user/:idUser/updateTwitter/:idTwitter', checkId,twitterController.updateTwitter) // UPDATE TT
app.delete('/user/:idUser/deleteTwitter/:idTwitter',  checkId, twitterController.deleteTwitter) // DELETE TT

// REPLY
app.post('/user/:idUser/reply/:idTwitter', replyController.replyTwitter) // CRIAR REPLY
app.put('/user/:idUser/updateReply/:idTwitter',replyController.updaterEPLY)// UPDATE REPLY
app.delete('/user/:idUser/deleteReply/:idTwitter',replyController.deleteReply)// DELETE REPLY

app.listen(3335, () => {
    console.log("A API está rodando!");
});