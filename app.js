const express = require('express')
const app = express()
const router = require('./routes')
const session = require('express-session')


const PORT = 3000


app.set("view engine", 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'hacktiv-secret', // harus ada
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, //https //false : development // true : production
        sameSite: true }  // untuk security dari csrf attack
}))

app.use(router)

app.listen(PORT, () => {
    console.log("JALANKAN", PORT);
    
})