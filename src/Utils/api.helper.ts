import express from "express";
import cors from 'cors';
import { UserController } from "../Controllers/user.controller";
import { TwitterController } from "../Controllers/tweet.controller";
import { ReplyController } from "../Controllers/reply.controller";
import { LikeController } from "../Controllers/like.controller";
import { FollowController } from "../Controllers/follow.controller";
import { StartController } from "../Controllers/start.controller";
import { LoginController } from "../Controllers/login.controler";
import { checkId } from "../middlewares/checkId";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const userController = new UserController()
    const twitterController = new TwitterController()
    const replyController = new ReplyController()
    const likeController = new LikeController()
    const followController = new FollowController()
    const startController = new StartController()
    const loginController = new LoginController()

    // START
    app.get('/', startController.start)

    // USER
    app.post('/', userController.createUser) //  CREATE USER
    app.post('/user/login', loginController.login) // LOGIN
    app.put('/user/:idUser', checkId, userController.updateUser) // UPDATE
    app.delete('/user/:idUser', checkId, userController.deleteUser) // DELETE

    // TWEETS
    app.get('/user/:idUser/home', checkId, twitterController.viewTweets) // VIEW ALL TWEETE
    app.post('/user/:idUser/', checkId, twitterController.createTweet) // CREATE TWEETE
    app.put('/user/:idUser/twitter/:idTwitter', checkId, twitterController.updateTweet) // UPDATE TWEETE
    app.delete('/user/:idUser/twitter/:idTwitter', checkId, twitterController.deleteTweet) // DELETE TWEETE
    app.get('/user/:idUser', checkId, twitterController.tweetsUser) // VIEW USER TWEET

    // REPLY
    app.post('/user/:idUser/reply/:idTwitter', checkId, replyController.replyTwitter) // CREATE REPLY
    app.put('/user/:idUser/reply/:idTwitter', checkId, replyController.updaterReply)// UPDATE REPLY
    app.delete('/user/:idUser/reply/:idTwitter', checkId, replyController.deleteReply)// DELETE REPLY

    // LIKE
    app.post('/user/:idUser/like/:twitterId', checkId, likeController.likeTwitter) // LIKE and DESLIKE in TT

    //FOLLOW
    app.post('/user/:idUser/follow/:idFollow', checkId, followController.follow) // FOLLOW and UNFOLLOW

    return app
}