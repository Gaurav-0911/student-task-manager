const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Page load hone par saved tasks dikhao
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task button
button.addEventListener("click", addTask);

// Enter key se bhi add hoga
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    createTask(taskText, false);

    saveTask(taskText, false);

    input.value = "";
}

// Task create function
function createTask(taskText, completed) {

    const li = document.createElement("li");

    li.innerHTML = `
        <span class="task-text ${completed ? "completed" : ""}">
            ${taskText}
        </span>

        <div class="actions">
            <button class="complete-btn">Done</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(li);

    // Complete button
    li.querySelector(".complete-btn").addEventListener("click", () => {

        const taskSpan = li.querySelector(".task-text");

        taskSpan.classList.toggle("completed");

        updateLocalStorage();
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {

        li.remove();

        updateLocalStorage();
    });
}

// Save task in local storage
function saveTask(taskText, completed) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({
        text: taskText,
        completed: completed
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load saved tasks
function loadTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        createTask(task.text, task.completed);
    });
}

// Update local storage after delete/complete
function updateLocalStorage() {

    const allTasks = [];

    document.querySelectorAll(".task-list li").forEach(li => {

        const text =
            li.querySelector(".task-text").innerText;

        const completed =
            li.querySelector(".task-text")
            .classList.contains("completed");

        allTasks.push({
            text,
            completed
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(allTasks)
    );
}