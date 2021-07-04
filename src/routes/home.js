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
    db.Todo.findAll({where:{user_id:req.user.id}}).then(todos => {
      const todoDueList = [];
      for(let i in todos){
        let dueDate = todos[i].dueDate;
        todoDueList[i] = dueDate.getFullYear() + '年' + dueDate.getMonth() + '月' + dueDate.getDate() + '日';
      }
      const data = {
        title: 'test',
        user_name: req.user.name,
        todos: todos,
        todoDueList: todoDueList,
      }
      res.render('home', data);
    })
});

module.exports = router;
