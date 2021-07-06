var express = require('express');
var router = express.Router();
const db = require('../models');

const bcrypt = require('bcrypt');
const { route } = require('./signup');
const { render } = require('../app');
const now = new Date();
now.setHours( now.getHours + 9 );

const authMiddleware = (req, res, next) => {
  if(req.isAuthenticated()) { // ログインしてるかチェック
    next();
  } else {
    res.redirect(302, '/login');
  }
};

/* GET users listing. */
router.get('/', authMiddleware, (req, res, next) => {
    req.session.errorAddTodo = null;
    req.session.errorUpdateTodo = null;
    req.session.errorPass = null;
    req.session.successPass = null;
    db.Users.findByPk(req.user.id).then( user => {
        req.user = user;
        const data = {
            user: user,
            user_name: req.user.name,
            errorMessage: req.session.errorUpdateUser,
        }
        res.render('user/index', data);
    });
});

router.post('/update', authMiddleware, (req, res, next) => {
    db.Users.findByPk(req.user.id).then( user => {
        user.name = req.body.name,
        user.email = req.body.email,
        user.age = req.body.age,
        user.save().then( () => {
            req.session.errorUpdateUser = null;
            res.redirect('/user');
        }).catch(err=>{
            req.session.errorUpdateUser = err;
            res.redirect('/user');
        })
    });
})

router.get('/changePass', authMiddleware, (req, res, next) => {
    req.session.errorAddTodo = null;
    req.session.errorUpdateTodo = null;
    req.session.errorUpdateUser = null;
    const data = {
        user_name: req.user.name,
        errorMessage: req.session.errorPass,
        successMessage: req.session.successPass,
    }
    res.render('user/changePass', data);
})

router.post('/changePass/update', authMiddleware, (req, res, next) => {
    db.Users.findByPk(req.user.id).then( user => {
        if(!bcrypt.compareSync(req.body.passCurrent, user.password)){
            req.session.successPass = null
            req.session.errorPass = 'パスワードを正確に入力してください'
            res.redirect('/user/changePass');
        }
        if(req.body.passNew !== req.body.passConfirm || req.body.passNew === '' || req.body.passConfirm === ''){
            req.session.successPass = null
            req.session.errorPass = 'パスワードを正確に入力してください'
            res.redirect('/user/changePass');
        }
        user.password = bcrypt.hashSync(req.body.passNew, bcrypt.genSaltSync(8));
        user.save().then( () => {
            req.session.errorPass = null
            req.session.successPass = 'パスワードを変更しました'
            res.redirect('/user/changePass');
        });
    })
});

module.exports = router;
