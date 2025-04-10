const Controller = require('../controllers/controller')
const UserController = require('../controllers/UserController')
const { isAdmin, isLoggedIn } = require('../midllewares/middleware')
const router = require('express').Router()


//GET / register
router.get('/register', UserController.registerForm)

// POST / register
router.post('/register', UserController.postRegister)


//GET / login
router.get('/login', UserController.loginForm)


// POST / login
router.post('/login', UserController.postLogin)

// get / logout
router.get('/logout',isLoggedIn,  UserController.getLogout)




router.use(isLoggedIn)

router.get('/home', isLoggedIn, UserController.home)// untuk test aja

// MISAL ADA ADDPOST


// MISAL ADA EDIT







module.exports = router