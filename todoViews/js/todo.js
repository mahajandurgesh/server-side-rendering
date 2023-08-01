var submit = document.getElementById('submit');
var input = document.getElementById('input');
var header = document.querySelector('header');
var logout = document.getElementById('logout');

var welcome = document.createElement('p');



// fetch('/getUsername', {
//     method: 'get'
// }).then(function(response) {
//     if(response.ok) {
//         return response.json();
//     } else {
//         throw new Error(response.message);
//     }
// }).then(function(user) {
//     welcome.innerHTML = 'Welcome '+ user.username + '!';
//     header.appendChild(welcome);
// });


//renderTodoList();

submit.addEventListener('click', function() {
    if(input.value != '') {
        let todoContent = input.value;
        fetch('/todo', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({todoContent})
        }).then(function(response) {
            if(response.ok) {
                input.value = '';
                renderTodoList();
            } else {
                throw new Error(response.message);
            }
        });
    }
});

logout.addEventListener('click', function() {
    fetch('/logout', {
        method: 'get'
    }).then(function(response) {
        if(response.ok) {
            window.location.href = '/login';
        } else {
            throw new Error(response.message);
        }
    });
});




// function renderTodoList() {
//     fetch('/getTodos', {
//         method: 'get'
//     }).then(function(response) {
//         if(response.ok) {
//             return response.json();
//         } else {
//             throw new Error(response.message);
//         }
//     }).then(function(todos) {
//         let todoList = document.getElementById('todo-list');
//         todoList.innerHTML = '';
//         for(let i = 0; i < todos.length; i++) {
//             renderTodoItem(todos[i], i);
//         }
//     });
// }

// function renderTodoItem(todo, id) {
//     let todoList = document.getElementById('todo-list');
//     let todoItem = document.createElement('li');
//     let todoContentDiv = document.createElement('div');
//     let todoActionsDiv = document.createElement('div');
//     let todoCheckbox = document.createElement('input');
//     let todoDeleteButton = document.createElement('button');

//     todoItem.className = 'todo-item';
//     todoActionsDiv.className = 'todo-actions';

//     todoCheckbox.type = 'checkbox';
//     todoCheckbox.value = id;
//     // todoCheckbox.addEventListener('change', function() {
//     //     let todoId = this.value;
//     //     let todoCompleted = this.checked;
//     //     updateTodoById(todoId, todoCompleted, function(err) {
//     //         if(err) {
//     //             console.log(err);
//     //         } else {
//     //             renderTodoList();
//     //         }
//     //     });
//     // });
//     todoActionsDiv.appendChild(todoCheckbox);

    
//     todoDeleteButton.className = 'delete-todo';
//     todoDeleteButton.innerHTML = 'Delete';
//     todoDeleteButton.value = id;

//     // todoDeleteButton.addEventListener('click', function() {
//     //     let todoId = this.value;
//     //     deleteTodoById(todoId, function(err) {
//     //         if(err) {
//     //             console.log(err);
//     //         } else {
//     //             renderTodoList();
//     //         }
//     //     });
//     // });
//     todoActionsDiv.appendChild(todoDeleteButton);

//     if(todo.todoCompleted) {
//         todoContentDiv.className = 'todo-content-completed';
//         todoCheckbox.checked = true;
//     }
//     else {
//         todoContentDiv.className = 'todo-content-incomplete';
//     }
//     todoContentDiv.innerHTML = todo.todoContent;
//     todoItem.appendChild(todoContentDiv);
//     todoItem.appendChild(todoActionsDiv);

//     todoList.appendChild(todoItem);
// }

// function getTodos(callback){
//     fetch('/todos', {
//         method: 'get'
//     }).then(function(response){
//         if(response.ok){
//             callback(null, response.json());
//         } else {
//             callback(response.message);
//         }
//     });
// }

function updateTodoById(todoId, todoCompleted, callback){
    fetch('/updateTodo', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({todoId, todoCompleted})
    }).then(function(response){
        if(response.ok){
            callback(null);
        } else {
            callback(response.message);
        }
    });
}

function deleteTodoById(todoId, callback){
    fetch('/deleteTodo', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({todoId})
    }).then(function(response){
        if(response.ok){
            callback(null);
        } else {
            callback(response.message);
        }
    });
}

function deleteClickHandler(deleteButton){
    let todoId = deleteButton.value;
    deleteTodoById(todoId, function(err){
        if(err){
            console.log(err);
        } else {
            location.reload();
        }
    });
}

function checkboxChangeHandler(checkbox){
    let todoId = checkbox.value;
    let todoCompleted = checkbox.checked;
    updateTodoById(todoId, todoCompleted, function(err) {
        if(err) {
            console.log(err);
        } else {
            location.reload();
        }
    });
}