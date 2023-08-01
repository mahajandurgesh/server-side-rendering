var submit = document.getElementById('submit');
var input = document.getElementById('input');
var header = document.querySelector('header');
var logout = document.getElementById('logout');

if(submit) {
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
                    location.reload();
                } else {
                    throw new Error(response.message);
                }
            });
        }
    });
}

if(logout){
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
}


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