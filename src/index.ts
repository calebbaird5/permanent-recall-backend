import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { userRouter } from './routers/user.router'
import { roleRouter } from './routers/role.router'
import MongooseService from './services/mongoose.service'
// import { tokenGuard } from './middlewares/token-guard'
let db = new MongooseService();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


app.use('/users', userRouter());
app.use('/roles', roleRouter());

// app.use(tokenGuard());

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});
