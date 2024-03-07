let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let pomodoroContainer = document.getElementById("pomodoroContainer");
let pomodoroTimer;
let pomodoroTime = 25 * 60; // 25 minutes in seconds
let isPomodoroRunning = false;
// Add this at the beginning of your JavaScript code
let bell = new Audio('./bellsound/bell.mp3');
let applause=new Audio('./bellsound/small.mp3');
let finish=new Audio('./bellsound/finish.wav');


let customPomodoroButton = document.getElementById("startCustomPomodoroButton");
let customPomodoroTimeInput = document.getElementById("customPomodoroTime");

customPomodoroButton.addEventListener("click", startCustomPomodoro);

function startCustomPomodoro() {
    let customPomodoroTime = parseInt(customPomodoroTimeInput.value, 10);

    if (isNaN(customPomodoroTime) || customPomodoroTime <= 0) {
        alert("Please enter a valid custom Pomodoro time.");
        return;
    }

    bell.play();
    showNotification(`Custom Pomodoro (${customPomodoroTime} minutes) started \uD83D\uDE03`);
    
    // Set custom Pomodoro time
    pomodoroTime = customPomodoroTime * 60;

    // Start the timer
    pomodoroTimer = setInterval(updatePomodoro, 1000);
    isPomodoroRunning = true;
}



// Add this function for showing notifications
function showNotification(message) {
    // Create a new notification container
    const notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification-container");
    document.body.appendChild(notificationContainer);

    // Set the content for the notification
    notificationContainer.textContent = message;

    // Slide in from the top and fade in simultaneously
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

// Add this function for hiding notifications
function hideNotification(container) {
    // Slide out to the top and fade out simultaneously
    anime({
        targets: container,
        top: -50,
        opacity: 0,
        duration: 800,
        easing: 'easeInQuart',
        complete: () => {
            container.style.display = "none";
            document.body.removeChild(container); // Remove the container from the DOM
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
        // Pomodoro completed, reset and notify
        resetPomodoro();
        showNotification("Pomodoro completed! Take a break. \uD83D\uDE03");
        finish.play();
        
    }
}

// Event listener for the start/pause button
let pomodoroButton = document.getElementById("pomodoroButton");
pomodoroButton.addEventListener("click", togglePomodoro,);

// Event listener for the reset button
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetPomodoro);

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.addEventListener("click", function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
});

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    onAddTodo();
};
document.addEventListener("DOMContentLoaded", function() {
    const todoUserInput = document.getElementById("todoUserInput");
    todoUserInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            onAddTodo();
        }
    });
});



function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    let todoElement = document.getElementById(todoId); // Get the entire task container

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;

        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoList[todoObjectIndex];

    if (todoObject.isChecked === true) {
        todoObject.isChecked = false;
        labelElement.classList.remove("checked");
        // Change the background color back to its original when unchecked
        todoElement.style.backgroundColor = "white";
    } else {
        todoObject.isChecked = true;
        showNotification("Task completed \uD83D\uDC4F");
        labelElement.classList.add("checked");
        
    }

    // Update localStorage
    updateLocalStorage();
}


function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    todoList.splice(deleteElementIndex, 1);
}

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

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
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
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Category";
    categoryInput.classList.add("category-input");
    labelContainer.appendChild(categoryInput);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };
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


    deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}
// Function to update localStorage
function updateLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    todoList = todoList.filter(todo => !todo.isChecked);
    const completedTasks = document.querySelectorAll('.checked');
    completedTasks.forEach(task => {
    todoItemsContainer.removeChild(task.parentElement.parentElement);
    showNotification("You're Doing Fantastic - Keep Going! \uD83C\uDF89");
    applause.play();
    });
    updateLocalStorage();
}

// Function to mark all tasks as completed
function markAllTasksAsCompleted() {
    todoList.forEach(todo => (todo.isChecked = true));
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        const labelId = checkbox.getAttribute('id').replace('checkbox', 'label');
        document.getElementById(labelId).classList.add('checked');
        showNotification("All Tasks Completed \uD83C\uDF89");
    });
    updateLocalStorage();
}

// Event listener for "Clear Completed" button
let clearCompletedButton = document.getElementById('clearCompletedButton');
clearCompletedButton.addEventListener('click', clearCompletedTasks);

// Add this part to stop blinking after clearing completed tasks
clearCompletedButton.addEventListener('click', () => {
  // Add the "blink" class to start the animation
  document.getElementById("refresh-button").classList.add("blink");

  // Stop blinking after 3000 milliseconds (adjust as needed)
  setTimeout(function () {
    // Remove the "blink" class to stop the animation
    document.getElementById("refresh-button").classList.remove("blink");
  }, 5000);
});



// Event listener for "Mark All Completed" button
let markAllCompletedButton = document.getElementById('markAllCompletedButton');
markAllCompletedButton.addEventListener('click', markAllTasksAsCompleted);

function onEditTodo(todoId) {
    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;

        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoList[todoObjectIndex];

    let updatedText = prompt("Edit the task:", todoObject.text);

    if (updatedText !== null) {
        todoObject.text = updatedText;
        updateLocalStorage();
        document.getElementById("label" + todoObject.uniqueNo).textContent = updatedText;
    }
}

// Add this at the beginning of your JavaScript code to get the search input element
let searchInput = document.getElementById("searchInput");

// Add an event listener to handle search input changes
searchInput.addEventListener("input", function() {
    let searchText = searchInput.value.toLowerCase();

    for (let todo of todoList) {
        let todoId = "todo" + todo.uniqueNo;
        let labelId = "label" + todo.uniqueNo;
        let labelElement = document.getElementById(labelId);

        if (labelElement) {
            let todoText = todo.text.toLowerCase();

            // Check if the task text contains the search text
            if (todoText.includes(searchText)) {
                labelElement.style.display = "block";
            } else {
                labelElement.style.display = "none";
            }
        }
    }
});