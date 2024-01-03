import express, { Request, Response } from "express";
import cors from 'cors';
import { UserController } from "./Controllers/user.controller";

const app = express();
app.use(express.json());
app.use(cors());

const userController = new UserController()
app.post('/createuser', userController.createUser)
app.get('/user/:idUser', userController.searcheUser)

app.listen(3335, () => {
    console.log("A API está rodando!");
});