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
    req.session.errorAddTodo = null;
    req.session.errorUpdateTodo = null;
    req.session.errorUpdateUser = null;
    req.session.errorPass = null;
    req.session.successPass = null;
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
    req.session.errorUpdateTodo = null;
    req.session.errorUpdateUser = null;
    req.session.errorPass = null;
    req.session.successPass = null;
    const data = {
        user_name: req.user.name,
        errorMessage: req.session.errorAddTodo,
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
            req.session.errorAddTodo = null;
            res.redirect('/todo');
        }).catch(err=>{
            req.session.errorAddTodo = err;
            res.redirect('/todo/add');
        });
})

router.get('/:id', authMiddleware, (req, res, next) => {
    req.session.errorAddTodo = null;
    req.session.errorUpdateUser = null;
    req.session.errorPass = null;
    req.session.successPass = null;
    db.Todo.findOne({where:{id:req.params.id}})
    .then(todo => {
        const dueDate = todo.dueDate.getFullYear() + '-' + ("0"+(todo.dueDate.getMonth() + 1)).slice(-2) + '-' + ("0"+(todo.dueDate.getDate() + 1)).slice(-2);
        const checked = {
            high: '',
            middle: '',
            low: '',
        };
        switch(todo.priority){
            case 'high':
                checked.high = 'checked';
                break;
            case 'middle':
                checked.middle = 'checked';
                break;
            case 'low':
                checked.low = 'checked';
                break;
        }
        const data = {
            title: 'test',
            todo: todo,
            dueDate: dueDate,
            user_name: req.user.name,
            checked: checked,
            errorMessage: req.session.errorUpdateTodo,
        }
        res.render('todo/detail', data);
    });
})

router.post('/:id/update', (req, res, next) => {
    db.Todo.findByPk(req.params.id).then(todo => {
        todo.title = req.body.title;
        todo.memo = req.body.memo;
        todo.priority = req.body.priority;
        todo.dueDate = new Date(req.body.dueDate);
        todo.save().then( () => {
            res.session.errorUpdateTodo = null;
            res.redirect('/todo/'+req.params.id);
        }).catch( err => {
            req.session.errorUpdateTodo = err;
            res.redirect('/todo/'+req.params.id);
        });
    })
});

router.post('/:id/delete', (req, res, next) => {
    db.Todo.findByPk(req.params.id).then(todo => {
        todo.destroy().then(() => {
            res.redirect('/todo');
        })
    })
})

module.exports = router;
