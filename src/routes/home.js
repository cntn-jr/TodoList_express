var express = require('express');
var router = express.Router();
const db = require('../models');

const authMiddleware = (req, res, next) => {
  if(req.isAuthenticated()) { // ログインしてるかチェック
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
    res.render('home', data);
  })
});

module.exports = router;