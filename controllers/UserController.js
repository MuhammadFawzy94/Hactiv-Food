const { where } = require('sequelize')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
    static async home(req, res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }

    static async registerForm(req, res) {
        try {
            res.render('registerForm')
        } catch (error) {
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const { username, email, password, role } = req.body
            User.create({ username, email, password, role })
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginForm(req, res) {
        try {
            const { error } = req.query
            res.render('loginForm', { error })
        } catch (error) {
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ where: { username } })
            console.log(user.id, "IDIDIDIDID");
            console.log(user.password, "PASSSWORRDD");

            if (user) {

                const isValidPassword = bcrypt.compareSync(password, user.password);
                console.log(isValidPassword, "APAKAH JAWABANYA");

                if (isValidPassword) {
                    // console.log(req.session, '<<<<<<');
                    req.session.userId = user.id;
                    req.session.role = user.role;
                    console.log(req.session.userId = user.id);


                    return res.redirect('/home');
                } else {
                    const error = "Invalid username/password";
                    return res.redirect(`/login?error=${error}`);
                }
            } else {
                const error = "Invalid username/password";
                return res.redirect(`/login?error=${error}`);
            }
        } catch (err) {
            res.send(err)
        }
    }


    static async getLogout(req, res) {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            res.redirect('/login');
        } catch (err) {
            res.send(err);
        }
    }
}



module.exports = UserController
