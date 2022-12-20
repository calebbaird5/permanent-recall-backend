import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { userRouter } from './routers/user.router'
import { authRouter } from './routers/auth.router'
import { roleRouter } from './routers/role.router'
import { passageRouter } from './routers/passage.router'
import MongooseService from './services/mongoose.service'
import * as cookieParser from 'cookie-parser'
import { auth } from './controllers/auth.controller'

let db = new MongooseService();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());


app.use('/auth', authRouter());
app.use('/users', auth, userRouter());
app.use('/roles', auth, roleRouter());
app.use('/passages', auth, passageRouter());

// app.use(tokenGuard());

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});
