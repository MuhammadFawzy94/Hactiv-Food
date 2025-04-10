const Controller = require('../controllers/Controller'); // Controller untuk fitur restoran
const UserController = require('../controllers/UserController'); // Controller untuk autentikasi
const { isAdmin, isLoggedIn } = require('../midllewares/middleware');
const router = require('express').Router();

// Rute Autentikasi
router.get('/register', UserController.registerForm); // Menampilkan form register
router.post('/register', UserController.postRegister); // Proses register
router.get('/login', UserController.loginForm); // Menampilkan form login
router.post('/login', UserController.postLogin); // Proses login
router.get('/logout', isLoggedIn, UserController.getLogout); // Logout

// Middleware untuk memastikan pengguna sudah login sebelum mengakses fitur restoran
router.use(isLoggedIn);

// Rute Fitur Restoran
router.get('/home', UserController.home); // Halaman home (dari UserController untuk testing)
router.get('/restaurant', Controller.restaurant); // Daftar restoran dengan fitur search
router.get('/restaurant/:id', Controller.restaurantById); // Detail restoran dan menu
router.post('/input', Controller.input); // Form input order
router.get('/order', Controller.order); // Halaman order dengan tombol qty dan delete
router.post('/order/input/:MenuId', Controller.inputOrder); // Menambah/mengurangi qty di halaman order
router.post('/order/delete/:MenuId', Controller.deleteMenu); // Menghapus menu dari order
router.post('/order/complete', Controller.completeOrder)

module.exports = router;