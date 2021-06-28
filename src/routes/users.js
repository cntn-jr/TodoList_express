var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.Users.findAll().then(users=>{
    const data = {
      title: 'test',
      users: users,
    }
    res.render('index', data);
  })
});

module.exports = router;
