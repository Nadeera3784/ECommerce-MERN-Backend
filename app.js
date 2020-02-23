const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()

//db connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

// load routes
const userRouter = require('./routes/user.route')
app.use('/api', userRouter)

app.use( (req, res, next) => {
    res.send('page not founded');
});
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});