const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

button.addEventListener("click", addTask);

function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span class="task-text">${taskText}</span>

        <div class="actions">
            <button class="complete-btn">Done</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(li);

    input.value = "";

    // Complete button
    li.querySelector(".complete-btn").addEventListener("click", () => {
        li.querySelector(".task-text").classList.toggle("completed");
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });
}