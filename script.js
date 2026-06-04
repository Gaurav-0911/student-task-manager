// =========================
// Select DOM Elements
// =========================
const taskInput =
    document.getElementById("taskInput");

const dueDateInput =
    document.getElementById("dueDate");

const priorityInput =
    document.getElementById("priority");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const searchTask =
    document.getElementById("searchTask");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");

// Counter
const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

// Progress
const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");


// =========================
// Load Data on Page Load
// =========================
document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadTasks();
        loadTheme();
        updateCounter();
        updateProgress();
    }
);


// =========================
// Add Task Events
// =========================
addTaskBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    function (e) {

        if (e.key === "Enter") {
            addTask();
        }
    }
);


// =========================
// Add Task Function
// =========================
function addTask() {

    const taskText =
        taskInput.value.trim();

    const dueDate =
        dueDateInput.value;

    const priority =
        priorityInput.value;

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }

    createTask(
        taskText,
        dueDate,
        priority,
        false
    );

    saveTasks();

    taskInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "Low";

    updateCounter();
    updateProgress();
}


// =========================
// Create Task Function
// =========================
function createTask(
    taskText,
    dueDate,
    priority,
    completed
) {

    const li =
        document.createElement("li");

    li.classList.add("task-item");

    li.innerHTML = `
    
    <div class="task-info">

        <div class="task-text 
        ${completed ? "completed" : ""}">
        
        ${taskText}
        
        </div>

        <div class="task-details">
        
            📅 Due:
            ${dueDate || "No Date"}
            |
            🔥 Priority:
            ${priority}
            
        </div>

    </div>

    <div class="task-buttons">

        <button class="complete-btn">
            ✓
        </button>

        <button class="edit-btn">
            Edit
        </button>

        <button class="delete-btn">
            Delete
        </button>

    </div>
    `;

    taskList.appendChild(li);


    // =====================
    // Complete Task
    // =====================
    li.querySelector(".complete-btn")
        .addEventListener("click",
            () => {

                li.querySelector(".task-text")
                    .classList.toggle(
                        "completed"
                    );

                saveTasks();
                updateCounter();
                updateProgress();
            });


    // =====================
    // Edit Task
    // =====================
    li.querySelector(".edit-btn")
        .addEventListener("click",
            () => {

                const task =
                    li.querySelector(
                        ".task-text"
                    );

                const updatedTask =
                    prompt(
                        "Edit task:",
                        task.innerText
                    );

                if (
                    updatedTask !== null
                    &&
                    updatedTask.trim()
                    !== ""
                ) {

                    task.innerText =
                        updatedTask.trim();

                    saveTasks();
                }
            });


    // =====================
    // Delete Task
    // =====================
    li.querySelector(".delete-btn")
        .addEventListener("click",
            () => {

                li.remove();

                saveTasks();
                updateCounter();
                updateProgress();
            });
}


// =========================
// Save Tasks to Local Storage
// =========================
function saveTasks() {

    const tasks = [];

    document.querySelectorAll(
        ".task-item"
    ).forEach(task => {

        tasks.push({

            text:
                task.querySelector(
                    ".task-text"
                ).innerText,

            dueDate:
                task.querySelector(
                    ".task-details"
                ).innerText,

            completed:
                task.querySelector(
                    ".task-text"
                )
                    .classList.contains(
                        "completed"
                    )
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// =========================
// Load Tasks
// =========================
function loadTasks() {

    const tasks =
        JSON.parse(
            localStorage.getItem(
                "tasks"
            )
        ) || [];

    tasks.forEach(task => {

        createTask(
            task.text,
            "",
            "Low",
            task.completed
        );
    });
}


// =========================
// Update Counter
// =========================
function updateCounter() {

    const all =
        document.querySelectorAll(
            ".task-item"
        );

    const completed =
        document.querySelectorAll(
            ".completed"
        );

    totalTasks.innerText =
        all.length;

    completedTasks.innerText =
        completed.length;

    pendingTasks.innerText =
        all.length -
        completed.length;
}


// =========================
// Progress Bar
// =========================
function updateProgress() {

    const total =
        document.querySelectorAll(
            ".task-item"
        ).length;

    const completed =
        document.querySelectorAll(
            ".completed"
        ).length;

    const percent =
        total === 0
            ? 0
            : Math.round(
                (completed / total)
                * 100
            );

    progressFill.style.width =
        percent + "%";

    progressText.innerText =
        percent + "%";
}


// =========================
// Filter Tasks
// =========================
filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );

            button.classList.add(
                "active"
            );

            const filter =
                button.dataset.filter;

            document
                .querySelectorAll(
                    ".task-item"
                )
                .forEach(task => {

                    const completed =
                        task.querySelector(
                            ".task-text"
                        )
                            .classList.contains(
                                "completed"
                            );

                    if (
                        filter === "all"
                    ) {
                        task.style.display =
                            "flex";
                    }

                    else if (
                        filter ===
                        "completed"
                    ) {

                        task.style.display =
                            completed
                                ? "flex"
                                : "none";
                    }

                    else if (
                        filter ===
                        "pending"
                    ) {

                        task.style.display =
                            !completed
                                ? "flex"
                                : "none";
                    }
                });
        });
});


// =========================
// Search Task
// =========================
searchTask.addEventListener(
    "input",
    () => {

        const value =
            searchTask.value
                .toLowerCase();

        document
            .querySelectorAll(
                ".task-item"
            )
            .forEach(task => {

                const text =
                    task.innerText
                        .toLowerCase();

                task.style.display =
                    text.includes(value)
                        ? "flex"
                        : "none";
            });
    });


// =========================
// Clear All Tasks
// =========================
clearAllBtn.addEventListener(
    "click",
    () => {

        if (
            confirm(
                "Delete all tasks?"
            )
        ) {

            taskList.innerHTML = "";

            saveTasks();

            updateCounter();
            updateProgress();
        }
    });


// =========================
// Dark Mode
// =========================
darkModeBtn.addEventListener(
    "click",
    () => {

        document.body
            .classList.toggle(
                "dark-mode"
            );

        localStorage.setItem(
            "darkMode",

            document.body
                .classList.contains(
                    "dark-mode"
                )
        );
    });


// =========================
// Load Theme
// =========================
function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );

    if (
        darkMode === "true"
    ) {

        document.body
            .classList.add(
                "dark-mode"
            );
    }
}