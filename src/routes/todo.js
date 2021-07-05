var express = require('express');
var router = express.Router();
const db = require('../models');

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
      res.render('todo/index', data);
    })
});

router.get('/add', authMiddleware, (req, res, next) => {
    const data = {
        user_name: req.user.name
    }
    res.render('todo/add', data);
});

router.post('/add', authMiddleware, (req, res, next) => {
    db.sequelize.sync()
        .then( () => db.Todo.create({
            title: req.body.title,
            memo: req.body.memo,
            dueDate: new Date(req.body.dueDate),
            priority: req.body.priority,
            user_id: req.user.id,
        })).then( todo => {
            res.redirect('/home');
        });
})

module.exports = router;
