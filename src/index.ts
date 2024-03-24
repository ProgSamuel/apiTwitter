import { createApp } from "./Utils/api.helper";
import * as dotenv from "dotenv";
dotenv.config();

const app = createApp()

app.listen(3335, () => {
    console.log("A API está rodando!");
});