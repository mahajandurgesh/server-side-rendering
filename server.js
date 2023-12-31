const express = require('express');
const fs = require('fs');
const app = express();
var session = require('express-session')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))


app.listen(3000, function() {
    console.log('Server running on port 3000');
});

app.get('/', function(req, res) {
    if(req.session.username) {
        readTodosFromFile(function(err, todos) {
            if(err) {
                res.status(500).send('Error reading file');
            } else {
                res.render('index', {username: req.session.username, todos: todos});
            }
        });
    } else {
        res.render('login');
    }
});

app.get('/contact', function(req, res) {
    if(req.session.username) {
        res.render('contact', {username: req.session.username});
    } else {
        res.render('login');
    }
});

app.get('/about', function(req, res) {
    if(req.session.username) {
        res.render('about', {username: req.session.username});
    } else {
        res.render('login');
    }
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/login-style', function(req, res) {
    res.sendFile(__dirname + '/todoViews/css/login-style.css');
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            res.status(500).send('Error');
        } else {
            res.status(200).render('login', {success: 'Logged out successfully'});
        }
    });
});

app.get('/signup', function(req, res) {
    res.render('signup', {error: ''});
});

app.get('/css/style.css', function(req, res) {
    res.sendFile(__dirname + '/todoViews/css/style.css');
});

app.get('/todo.js', function(req, res) {
    res.sendFile(__dirname + '/todoViews/js/todo.js');
});

app.get('/getTodos', function(req, res) {
    if(!req.session.username) {
        return res.status(401).send('Unauthorized');
    }
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            res.status(200).send(todos);
        }
    });
});

app.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let users = [];
    fs.readFile('./users.json', 'utf8', function(err, data){
        if(err){
            res.send(500).send('internal server error');
        }
        else{
            users = JSON.parse(data);
            let userFound = false;
            users.forEach(user => {
                if(user.username === username && user.password === password){
                    req.session.username = username;
                    userFound = true;
                    return res.status(200).redirect('/');
                }
            });
            if(!userFound)
            {
                return res.render('login', {error: 'Invalid credentials'});
            }
        }
    });
});

app.post('/signup', function(req, res){
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    fs.readFile('./users.json', 'utf8', function(err, data){
        if(err){
            res.send(500).send('internal server error');
        }
        else{
            let users = JSON.parse(data);
            let userFound = false;
            users.forEach(function(user){
                if(user.email === email){
                    userFound = true;
                    return;
                }
            });
            if(userFound){
                return res.status(409).render('signup', {error: 'User already exists'})
            }
            else{
                users.push({email, username, password});
                fs.writeFile('./users.json', JSON.stringify(users), function(err){
                    if(err){
                        res.status(500).send('internal server error');
                    }
                    else{
                        res.status(200).render('login', {success: 'User created successfully'});
                    }
                });
            }
        }
    });
    
});

app.post('/todo', function(req, res) {
    let todoContent = req.body.todoContent;
    let todoCompleted = false;
    let todo = {todoContent, todoCompleted};
    appendTodoToFile(todo, function(err){
        if(err){
            res.status(500).send('Error writing to file');
        } else {
            res.status(200).send('Success');
        }
    });
});

app.post('/updateTodo', function(req, res) {
    let todoId = req.body.todoId;
    let todoCompleted = req.body.todoCompleted;
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            todos[todoId].todoCompleted = todoCompleted;
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    res.status(500).send('Error writing to file');
                } else {
                    res.status(200).send('Success');
                }
            });
        }
    });
});

app.post('/deleteTodo', function(req, res) {
    let todoId = req.body.todoId;
    readTodosFromFile(function(err, todos) {
        if(err) {
            res.status(500).send('Error reading file');
        } else {
            todos.splice(todoId, 1);
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    res.status(500).send('Error writing to file');
                } else {
                    res.status(200).send('Success');
                }
            });
        }
    });
});

function readTodosFromFile(callback){
    let todos = [];
    fs.readFile('./todos.json', 'utf8', function(err, data){
        if(err){
            callback(err);
        } else {
            todos = JSON.parse(data);
            callback(null, todos);
        }
    });
}

function appendTodoToFile(todo, callback){
    readTodosFromFile(function(err, todos){
        if(err){
            callback(err);
        } else {
            todos.push(todo);
            fs.writeFile('./todos.json', JSON.stringify(todos), function(err){
                if(err){
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}