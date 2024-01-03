import express, { Request, Response } from "express";
import cors from 'cors';
import { UserController } from "./Controllers/user.controller";
import { TwitterController } from "./Controllers/twitter.controller";

const app = express();
app.use(express.json());
app.use(cors());

const userController = new UserController()
const twitterController = new TwitterController()
app.post('/createuser', userController.createUser) 
// fazer o MIDD
app.post('/user/login', userController.login)
app.get('/user/:idUser', userController.searcheUser)
app.post('/user/:idUser/createtwitter', twitterController.createTwitter )

app.listen(3335, () => {
    console.log("A API está rodando!");
});