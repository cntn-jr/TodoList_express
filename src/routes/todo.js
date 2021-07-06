var express = require('express');
var router = express.Router();
const db = require('../models');
const todo = require('../models/todo');

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
    let filterKey = req.query.filterKey;
    let todosFiltered;
    switch(filterKey){
        case 'finished':
            todosFiltered = db.Todo.findAll({where:{user_id: req.user.id, doneTodo: true}});
            break;
        case 'all':
            todosFiltered = db.Todo.findAll({where:{user_id: req.user.id}});
            break;
        default:
            todosFiltered = db.Todo.findAll({where:{user_id: req.user.id, doneTodo: false}});
    }
    todosFiltered.then(todos => {
      const todoDueList = [];
      const priorityColorList = [];
      const doneDisabledList = [];
      for(let i in todos){
        let dueDate = todos[i].dueDate;
        todoDueList[i] = dueDate.getFullYear() + '年' + (dueDate.getMonth() + 1) + '月' + dueDate.getDate() + '日';
        let priority = todos[i].priority;
        switch(priority){
            case 'high':
                priorityColorList[i] = 'warning';
                break;
            case 'middle':
                priorityColorList[i] = 'success';
                break;
            case 'low':
                priorityColorList[i] = 'info';
                break;
        }
        if(!todos[i].done && (new Date() > new Date(todos[i].dueDate))){
            priorityColorList[i] = 'danger';
        }
        if(todos[i].doneTodo){
            doneDisabledList[i] = 'disabled';
        }else{
            doneDisabledList[i] = '';
        }
      }
      const data = {
        title: 'test',
        user_name: req.user.name,
        todos: todos,
        todoDueList: todoDueList,
        priorityColorList: priorityColorList,
        doneDisabledList: doneDisabledList,
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
        let doneChecked = ''
        if(todo.doneTodo){
            doneChecked = 'checked';
        }
        const data = {
            title: 'test',
            todo: todo,
            dueDate: dueDate,
            user_name: req.user.name,
            checked: checked,
            doneChecked: doneChecked,
            errorMessage: req.session.errorUpdateTodo,
        }
        res.render('todo/detail', data);
    });
})

router.post('/:id/update', (req, res, next) => {
    console.log(req.body.doneTodo);
    db.Todo.findByPk(req.params.id).then(todo => {
        todo.title = req.body.title;
        todo.memo = req.body.memo;
        todo.priority = req.body.priority;
        todo.dueDate = new Date(req.body.dueDate);
        if(req.body.doneTodo){
            todo.doneTodo = true;
        }else{
            todo.doneTodo = false;
        }
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

router.post('/doneUpdate',(req, res, next)=>{
    const doneList = req.body.done;
        db.Todo.findAll({
            where:{
                id:doneList
            }
        }).then(todos=>{
            for(let i in todos){
                todos[i].doneTodo = true;
                todos[i].save();
            }
        })
    res.redirect('/todo');
})

module.exports = router;
