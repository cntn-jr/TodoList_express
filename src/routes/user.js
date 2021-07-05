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
    db.Users.findByPk(req.user.id).then( user => {
        req.user = user;
        const data = {
            title: 'test',
            user: user,
            user_name: req.user.name,
            errorMessage: req.session.error,
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
            req.session.error = null;
            res.redirect('/user');
        }).catch(err=>{
            req.session.error = err;
            res.redirect('/user');
        })
    });
})

router.get('/changePass', authMiddleware, (req, res, next) => {
    const data = {
        title: 'test',
        user_name: req.user.name,
        errorMessage: req.session.error,
        successMessage: req.session.success,
    }
    res.render('user/changePass', data);
})

router.post('/changePass/update', authMiddleware, (req, res, next) => {
    db.Users.findByPk(req.user.id).then( user => {
        if(!bcrypt.compareSync(req.body.passCurrent, user.password)){
            req.session.success = null
            req.session.error = 'パスワードを正確に入力してください'
            res.redirect('/user/changePass');
        }
        if(req.body.passNew !== req.body.passConfirm || req.body.passNew === '' || req.body.passConfirm === ''){
            req.session.success = null
            req.session.error = 'パスワードを正確に入力してください'
            res.redirect('/user/changePass');
        }
        user.password = bcrypt.hashSync(req.body.passNew, bcrypt.genSaltSync(8));
        user.save().then( () => {
            req.session.error = null
            req.session.success = 'パスワードを変更しました'
            res.redirect('/user/changePass');
        });
    })
});

module.exports = router;
