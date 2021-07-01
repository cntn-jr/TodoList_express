var express = require('express');
var router = express.Router();
const db = require('../models');
const session = require('express-session');

const authMiddleware = (req, res, next) => {
  console.log(req.user);
  if(req.isAuthenticated()) { // ログインしてるかチェック

    console.log('logined')

    next();

  } else {

    res.redirect(302, '/login');

  }
};

/* GET users listing. */
router.get('/', authMiddleware, function(req, res, next) {
  db.Users.findAll().then(users=>{
    const data = {
      title: 'test',
      users: users,
    }
    res.render('index', data);
  })
});

module.exports = router;
