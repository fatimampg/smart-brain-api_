const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); 
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const { handleImage, handleApiCall } = require('./controllers/image');

const db = knex ({
    client: 'pg', 
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false, 
        }
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
}) 

app.post('/signin', (req, res) => { signin.handleSignin (req, res, db, bcrypt) })

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt) } ) //dependency injection (db and bcrypt)

app.get('/profile/:id', (req, res) => { profile.handleProfileGet (req, res, db)})

app.put('/image', (req, res) => { handleImage(req, res, db)})

app.post('/imageurl', (req, res) => { handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})