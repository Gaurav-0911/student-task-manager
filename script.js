const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

button.addEventListener("click", () => {
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);

    input.value = "";

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });
});