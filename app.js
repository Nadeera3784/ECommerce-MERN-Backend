const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
require('dotenv').config();

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`);
});

// midllewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// load routes
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);

app.use((req, res, next) => {
  res.send('page not founded');
});
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});