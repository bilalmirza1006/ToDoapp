const ul = document.getElementById('todos');
const inputBox = document.getElementById('input-box');
const url = "https://jsonplaceholder.typicode.com/todos";
let todos = [];
let editingTask = null;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    todos = data;
    displayTodos();
  })
  .catch(function (error) {
    console.log(error);
  });

function displayTodos() {
  ul.innerHTML = '';

  todos.forEach(function (todo) {
    let li = createTodoElement(todo);
    ul.appendChild(li);
  });
}

function createTodoElement(todo) {
  let li = document.createElement('li');
  let title = document.createElement('h5');
  title.innerHTML = `Title: ${todo.title}`;
  li.appendChild(title);

  const editButton = createButton("Edit", () => editTodoItem(todo));
  const deleteButton = createButton("Delete", () => deleteTodoItem(todo.id));

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");
  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(deleteButton);

  li.appendChild(buttonsDiv);

  return li;
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", clickHandler);
  return button;
}

function editTodoItem(todo) {
  inputBox.value = todo.title;
  editingTask = todo;
}

function updateTodoOnAPI(taskId, title) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({
      id: taskId,
      title: title,
      completed: editingTask.completed,
      userId: editingTask.userId,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("Edited task:", json);
      const updatedTaskIndex = todos.findIndex((task) => task.id === taskId);
      if (updatedTaskIndex !== -1) {
        todos[updatedTaskIndex] = json;
      }
    })
    .catch((error) => console.error("Error editing task:", error));
}

function deleteTodoItem(taskId) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Deleted task with ID:", taskId);
        todos = todos.filter((task) => task.id !== taskId);
        displayTodos();
      } else {
        console.error("Error deleting task with ID:", taskId);
      }
    })
    .catch((error) => console.error("Error deleting task:", error));
}

function addTask() {
  const taskText = inputBox.value.trim();
  if (taskText === "") {
    alert("You must write something!");
    return;
  }

  if (editingTask) {
    editingTask.title = taskText;
    updateTodoOnAPI(editingTask.id, taskText);
    editingTask = null;
  } else {
    const newTask = {
      userId: 1,
      id: todos.length + 1,
      title: taskText,
      completed: false,
    };

    todos.push(newTask);
    displayTodos();
    createTodoOnAPI(newTask);
  }

  inputBox.value = "";
}

function createTodoOnAPI(newTask) {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify(newTask),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log("Created task:", json);
      todos.push(json);
      displayTodos();
    })
    .catch((error) => console.error("Error creating task:", error));
}
