import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error';
import { NotFoundError } from './errors/not-found.error';

const app = express();
app.set('trust proxy', true); // Still accepts traffic even from proxied connection
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
}))

app.get('/', (req, res) => {
  res.send({ status: 'ok' });
});

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDb');
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => console.log(`Listening on port 3000`));
}

start();