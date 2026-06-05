// DOM Elements
// =========================
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchTask = document.getElementById("searchTask");

const clearAllBtn =document.getElementById("clearAllBtn");

const darkModeBtn =document.getElementById("darkModeBtn");

const aiSuggestBtn =
    document.getElementById("aiSuggestBtn");

const aiTipsBtn =
    document.getElementById("aiTipsBtn");

const aiResponse =
    document.getElementById("aiResponse");

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
// Load Data
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
// Smart AI Priority
// =========================
function smartPriority(task) {

    const text =
        task.toLowerCase();

    if (
        text.includes("exam") ||
        text.includes("urgent") ||
        text.includes("assignment") ||
        text.includes("deadline")
    ) {
        return "High";
    }

    else if (
        text.includes("study") ||
        text.includes("practice")
    ) {
        return "Medium";
    }

    return "Low";
}


// =========================
// Add Task
// =========================
function addTask() {

    const taskText =
        taskInput.value.trim();

    const dueDate =
        dueDateInput.value;

    let priority =
        priorityInput.value;

    if (taskText === "") {

        alert("Please enter task");

        return;
    }

    // AI Smart Priority
    priority =
        smartPriority(taskText);

    createTask(
        taskText,
        dueDate,
        priority,
        false
    );

    saveTasks();

    taskInput.value = "";
    dueDateInput.value = "";

    updateCounter();
    updateProgress();
    checkEmptyState();
    // Success Message
showToast("✅ Task Added Successfully");
 
}

// =========================
// Create Task
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


    // Complete Task
    li.querySelector(".complete-btn")
        .addEventListener("click",
            () => {

                li.querySelector(
                    ".task-text"
                )
                    .classList.toggle(
                        "completed"
                    );

                saveTasks();
                updateCounter();
                updateProgress();
            });


    // Edit Task
    li.querySelector(".edit-btn")
        .addEventListener("click",
            () => {

                const task =
                    li.querySelector(
                        ".task-text"
                    );

                const updatedTask =
                    prompt(
                        "Edit Task",
                        task.innerText
                    );

                if (
                    updatedTask &&
                    updatedTask.trim()
                ) {

                    task.innerText =
                        updatedTask;

                    saveTasks();
                }
            });


    // Delete Task
    li.querySelector(".delete-btn")
        .addEventListener("click",
            () => {

                li.remove();
                checkEmptyState();

                saveTasks();

                updateCounter();
                updateProgress();
            });
}


// =========================
// Save Tasks
// =========================
function saveTasks() {

    const tasks = [];

    document.querySelectorAll(
        ".task-item"
    )
        .forEach(task => {

            tasks.push({

                text:
                    task.querySelector(
                        ".task-text"
                    ).innerText,

                details:
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
checkEmptyState();


// =========================
// Counter
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
// Progress
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

                    else {

                        task.style.display =
                            !completed
                                ? "flex"
                                : "none";
                    }
                });
        });
});


// =========================
// Search
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

// REAL GEMINI AI SUGGESTION
// =========================
// =========================
// REAL GEMINI AI SUGGESTION
// =========================
// =========================
// PROFESSIONAL AI SUGGESTION
// =========================
aiSuggestBtn.addEventListener(
    "click",
    async () => {

        const task =
            taskInput.value.trim();

        if (!task) {

            aiResponse.innerHTML =
                "Please enter a task first.";

            return;
        }

        aiResponse.innerHTML =
            "🤖 Thinking...";

        try {

            const response =
                await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,

                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            contents: [
                                {
                                    parts: [
                                        {
                                            text:
`You are an AI Student Assistant.

Task: ${task}

Give:
1. Exactly 3 short subtasks
2. One short study tip

Format:
Subtask 1:
Subtask 2:
Subtask 3:
Study Tip:
`
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                );

            const data =
                await response.json();

            const result =
                data?.candidates?.[0]
                    ?.content?.parts?.[0]
                    ?.text;

            if (!result) {

                aiResponse.innerHTML =
                    "No suggestion found.";

                return;
            }

            // Format Result Beautifully
            aiResponse.innerHTML = `

            <div class="ai-result-card">

                <div class="ai-title">
                    🤖 AI Study Plan
                </div>

                <p>
                    ${result.replace(/\n/g, "<br>")}
                </p>

                <br>

                <button id="addAiTaskBtn"
                style="
                    background:#4facfe;
                    color:white;
                    border:none;
                    padding:10px 15px;
                    border-radius:8px;
                    cursor:pointer;
                ">

                ➕ Add Main Task

                </button>

            </div>
            `;


            // Auto Add Main Task
            document
                .getElementById(
                    "addAiTaskBtn"
                )
                .addEventListener(
                    "click",
                    () => {

                        addTaskBtn.click();
                    }
                );

        }

        catch (error) {

            console.error(error);

            aiResponse.innerHTML =
                "Gemini API Error.";
        }
    });


// =========================
// REAL PRODUCTIVITY TIP
// =========================
// =========================
// GEMINI PRODUCTIVITY TIP
// =========================
aiTipsBtn.addEventListener(
    "click",
    async () => {

        aiResponse.innerText =
            "🤖 Generating tip...";

        try {

            const response =
                await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,

                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            contents: [
                                {
                                    parts: [
                                        {
                                            text:
"Give one useful productivity tip for an MCA student in simple English."
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                );

            const data =
                await response.json();

            const result =
                data?.candidates?.[0]
                    ?.content?.parts?.[0]
                    ?.text;

            aiResponse.innerText =
                result ||
                "No tip found.";

        }

        catch (error) {

            console.error(error);

            aiResponse.innerText =
                "Gemini API Error.";
        }
    });
// =========================
// Clear All
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
            checkEmptyState();
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

// =========================
// TOAST NOTIFICATION
// =========================
function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );

    toast.innerText =
        message;

    toast.style.position =
        "fixed";

    toast.style.bottom =
        "20px";

    toast.style.right =
        "20px";

    toast.style.background =
        "#28a745";

    toast.style.color =
        "white";

    toast.style.padding =
        "14px 22px";

    toast.style.borderRadius =
        "10px";

    toast.style.fontWeight =
        "600";

    toast.style.boxShadow =
        "0 5px 15px rgba(0,0,0,0.2)";

    toast.style.zIndex =
        "9999";

    document.body
        .appendChild(
            toast
        );

    setTimeout(() => {

        toast.remove();

    }, 2500);
}


// =========================
// EMPTY TASK MESSAGE
// =========================
function checkEmptyState() {

    const tasks =
        document.querySelectorAll(
            ".task-item"
        );

    let emptyMessage =
        document.getElementById(
            "emptyMessage"
        );

    if (
        tasks.length === 0
    ) {

        if (!emptyMessage) {

            emptyMessage =
                document.createElement(
                    "p"
                );

            emptyMessage.id =
                "emptyMessage";

            emptyMessage.innerText =
                "📌 No tasks available. Add your first task.";

            emptyMessage.style.textAlign =
                "center";

            emptyMessage.style.marginTop =
                "20px";

            emptyMessage.style.color =
                "gray";

            taskList.appendChild(
                emptyMessage
            );
        }
    }

    else {

        if (emptyMessage) {

            emptyMessage.remove();
        }
    }
}