import { createApp } from "./Utils/api.helper";
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json'
import cors from 'cors';


import * as dotenv from "dotenv";
dotenv.config();

const app = createApp()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(cors());

app.listen(3335, () => {
    console.log("Server is running on port 3335 ");
});