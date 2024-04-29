let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let pomodoroContainer = document.getElementById("pomodoroContainer");

let pomodoroTimer;
let pomodoroTime = 25 * 60; // 25 minutes in seconds
let isPomodoroRunning = false;
let bell = new Audio('./bellsound/bell.mp3');
let applause = new Audio('./bellsound/small.mp3');
let finish = new Audio('./bellsound/finish.wav');
let customPomodoroButton = document.getElementById("startCustomPomodoroButton");
let customPomodoroTimeInput = document.getElementById("customPomodoroTime");
let todoList = [];

// Event listeners for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    addTodoButton.addEventListener("click", onAddTodo);
    todoUserInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            onAddTodo();
        }
    });
    pomodoroButton.addEventListener("click", togglePomodoro);
    resetButton.addEventListener("click", resetPomodoro);
    markAllCompletedButton.addEventListener('click', markAllTasksAsCompleted);
    loadTasksFromLocalStorage();
});


customPomodoroButton.addEventListener("click", startCustomPomodoro);


function startCustomPomodoro() {
    let customPomodoroTime = parseInt(customPomodoroTimeInput.value, 10);

    if (isNaN(customPomodoroTime) || customPomodoroTime <= 0) {
        alert("Please enter a valid custom Pomodoro time.");
        return;
    }

    bell.play();
    showNotification(`Custom Pomodoro (${customPomodoroTime} minutes) started \uD83D\uDE03`);
    pomodoroTime = customPomodoroTime * 60;
    pomodoroTimer = setInterval(updatePomodoro, 1000);
    isPomodoroRunning = true;
}

// Function to show notifications
function showNotification(message) {
    const notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification-container");
    document.body.appendChild(notificationContainer);
    notificationContainer.textContent = message;
    anime({
        targets: notificationContainer,
        top: 10,
        opacity: 1,
        duration: 800,
        easing: 'easeOutQuart'
    });
    setTimeout(() => {
        hideNotification(notificationContainer);
    }, 2000);
}

// Function to hide notifications
function hideNotification(container) {
    anime({
        targets: container,
        top: -50,
        opacity: 0,
        duration: 800,
        easing: 'easeInQuart',
        complete: () => {
            container.style.display = "none";
            document.body.removeChild(container);
        }
    });
}

// Function to start or pause the Pomodoro timer
function togglePomodoro() {
    if (isPomodoroRunning) {
        clearInterval(pomodoroTimer);
    } else {
        bell.play();
        showNotification("Pomodoro started \uD83D\uDE03");
        pomodoroTimer = setInterval(updatePomodoro, 1000);
    }
    isPomodoroRunning = !isPomodoroRunning;
}

// Function to update the Pomodoro display
function updatePomodoroDisplay() {
    let minutes = Math.floor(pomodoroTime / 60);
    let seconds = pomodoroTime % 60;
    pomodoroContainer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to reset the Pomodoro timer
function resetPomodoro() {
    clearInterval(pomodoroTimer);
    isPomodoroRunning = false;
    pomodoroTime = 25 * 60;
    updatePomodoroDisplay();
}

// Function to update the Pomodoro countdown
function updatePomodoro() {
    if (pomodoroTime > 0) {
        pomodoroTime--;
        updatePomodoroDisplay();
    } else {
        resetPomodoro();
        showNotification("Pomodoro completed! Take a break. \uD83D\uDE03");
        finish.play();
    }
}

// Function to add a new todo item
function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    let newTodo = {
        text: userInputValue,
        uniqueNo: todoList.length + 1,
        isChecked: false,
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";

    saveTasksToLocalStorage();
}


function markAllTasksAsCompleted() {
    const todos = document.querySelectorAll('.todo-item-container');
    todos.forEach((todo, index) => {
        const checkbox = todo.querySelector('.checkbox-input');
        checkbox.checked = true; 
        todo.style.animation = `fadeOut 0.5s ease forwards ${index * 0.1}s`;
        

    });
    setTimeout(() => {
        todos.forEach(todo => {
            todo.remove();
            const todoId = todo.id;
            const todoIndex = todoList.findIndex(todo => "todo" + todo.uniqueNo === todoId);
            if (todoIndex !== -1) {
                todoList[todoIndex].isChecked = true; // Mark as checked
                todoList[todoIndex].deleted = true; // Mark as deleted
            }
        });
        showNotification("All Tasks Completed \uD83C\uDF89");
        document.getElementById("refresh-button").classList.add("blink");
        finish.play();
        setTimeout(() => {
            document.getElementById("refresh-button").classList.remove("blink");
        }, 5000);
        saveTasksToLocalStorage();
    }, 500);
}


// Function to create and append a todo item
function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.classList.add("circle-checkbox");

    inputElement.onclick = function() {
        onTodoStatusChange(labelId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    labelContainer.appendChild(labelElement);

      // Create star container
   let starContainer = document.createElement("div");
   starContainer.classList.add("star-container");

   let star = document.createElement("span");
   star.classList.add("star");

   // Set star color based on the todo object
   if (todo.starColor) {
       starContainer.classList.add(todo.starColor);
   } else {
       starContainer.classList.add("green"); // Default color
   }

   star.textContent = "★";

   // Add click event listener to toggle star color
   star.addEventListener("click", function() {
       toggleStarColor(starContainer, todoId);
   });

   // Append star to the star container
   starContainer.appendChild(star);

   // Append star container to the label container
   labelContainer.appendChild(starContainer);


    let editButtonContainer = document.createElement("div");
    editButtonContainer.classList.add("edit-button-container");
    labelContainer.appendChild(editButtonContainer);

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";

    editButton.onclick = function() {
        onEditTodo(todoId);
    };

    editButtonContainer.appendChild(editButton);
}


function toggleStarColor(starContainer, todoId) {
    let todoObjectIndex = todoList.findIndex(todo => "todo" + todo.uniqueNo === todoId);
    let todoObject = todoList[todoObjectIndex];

    if (starContainer.classList.contains("green")) {
        starContainer.classList.remove("green");
        starContainer.classList.add("orange");
        todoObject.starColor = "orange"; // Update the todo object with the star color
    } else if (starContainer.classList.contains("orange")) {
        starContainer.classList.remove("orange");
        starContainer.classList.add("red");
        todoObject.starColor = "red"; // Update the todo object with the star color
    } else if (starContainer.classList.contains("red")) {
        starContainer.classList.remove("red");
        starContainer.classList.add("green");
        todoObject.starColor = "green"; // Update the todo object with the star color
    } else {
        // If none of the classes are present, default to green
        starContainer.classList.add("green");
        todoObject.starColor = "green"; // Update the todo object with the default star color
    }

    saveTasksToLocalStorage();
}

// Function to handle todo status change
function onTodoStatusChange(labelId, todoId) {
    let labelElement = document.getElementById(labelId);
    let todoElement = document.getElementById(todoId);
    let todoObject = todoList.find(todo => "todo" + todo.uniqueNo === todoId);

    if (todoObject.isChecked === false) {
        todoObject.isChecked = true;
        todoElement.style.animation = `fadeOut 0.7s ease forwards`;
        setTimeout(() => {
            todoElement.remove();
        }, 500);
        showNotification("Task completed \uD83D\uDC4F");
    }
    
    saveTasksToLocalStorage(); // Update local storage when task is completed
}

// Function to edit a todo item
function onEditTodo(todoId) {
    let todoObject = todoList.find(todo => "todo" + todo.uniqueNo === todoId);
    let updatedText = prompt("Edit the task:", todoObject.text);
    if (updatedText !== null) {
        todoObject.text = updatedText;
        document.getElementById("label" + todoObject.uniqueNo).textContent = updatedText;
    }
    saveTasksToLocalStorage(); // Update local storage when task is completed
}

function onDeleteTodo(todoId) {
    let todoIndex = todoList.findIndex(todo => todo.uniqueNo === parseInt(todoId.replace('todo', ''), 10));
    if (todoIndex !== -1) {
        todoList[todoIndex].deleted = true; // Mark the task as deleted
        let todoElement = document.getElementById(todoId);
        todoItemsContainer.removeChild(todoElement);
        saveTasksToLocalStorage();
    }
}

function saveTasksToLocalStorage() {
    
    localStorage.setItem("todoList", JSON.stringify(todoList));
    console.log(todoList);
}

function loadTasksFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList !== null) {
        todoList = parsedTodoList.filter(todo => !todo.isChecked && !todo.deleted);
        todoItemsContainer.innerHTML = ""; // Clear the container
        todoList.forEach(todo => {
            createAndAppendTodo(todo);
        });
    }
}
