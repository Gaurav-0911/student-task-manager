const input = document.querySelector("input");
const button = document.querySelector("button");
const taskList = document.querySelector(".task-list");

button.addEventListener("click", () => {
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        ${taskText}
        <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);

    input.value = "";

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });
});