const router = require('express').Router()

const User = require('../models/user')
const bcrypt = require('bcryptjs')

require('dotenv').config()
const secret = process.env.SECRET || 'the default secret';

const passport = require('passport')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res) => {
    User.findOne({ emailAddress: req.body.emailAddress })
        .then(user => {
            if (user) {
                let error = 'Email Address Exists in Database.'
                return res.status(400).json(error)
            } else {
                console.log("creating user");
                const newUser = new User({
                    name: req.body.name,
                    emailAddress: req.body.emailAddress,
                    userName: req.body.userName,
                    password: req.body.password
                })
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.status(400).json(err))
                    })
                })
            }
        })
})

router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "No Account Found";
                return res.status(404).json(errors)
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        if (isMatch) {
                            const payload = {
                                id: user._id,
                                name: user.userName
                            }
                            jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
                                if (err) res.status(500).json({ error: "Error signing token", raw: err })
                                res.json({ success: true, token: `Bearer ${token}` });
                            })
                        } else {
                            errors.password = "Password is incorrect";
                            res.status(400).json(errors);
                        }
                    }
                })
        })
})

module.exports = router