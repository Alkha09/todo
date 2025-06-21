 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask() {
      const taskInput = document.getElementById("taskInput");
      const dueDate = document.getElementById("dueDate");
      const priority = document.getElementById("priority");

      if (!taskInput.value.trim()) return;

      const task = {
        id: Date.now(),
        text: taskInput.value,
        dueDate: dueDate.value,
        priority: priority.value,
        completed: false
      };

      tasks.push(task);
      saveTasks();
      taskInput.value = "";
      dueDate.value = "";
      renderTasks();
    }

    function deleteTask(index) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }

    function toggleComplete(index) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    }

    function editTask(index) {
      const newText = prompt("Edit your task:", tasks[index].text);
      if (newText) {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
      }
    }

    function filterTasks() {
      const filter = document.getElementById("filter").value;
      const sortDate = document.getElementById("sortDate").checked;

      let filtered = [...tasks];
      if (filter !== "All") filtered = filtered.filter(t => t.priority === filter);
      if (sortDate) filtered.sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));

      renderTasks(filtered);
    }

    function clearTasks() {
      if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
      }
    }

    function renderTasks(list = tasks) {
      const container = document.getElementById("taskList");
      container.innerHTML = "";

      let completed = 0;
      list.forEach((task, index) => {
        const card = document.createElement("div");
        card.className = "task-card" + (task.completed ? " completed" : "");

        const priorityColor = {
          Low: "green",
          Medium: "orange",
          High: "red"
        }[task.priority];

        card.innerHTML = `
          <input type="checkbox" onchange="toggleComplete(${index})" ${task.completed ? "checked" : ""}>
          <strong class="${task.completed ? "done" : ""}">
            ${task.completed ? "✅ " : ""}${task.text}
          </strong><br>
          📅 ${task.dueDate || "No due date"} <br>
          <span style="color: ${priorityColor}">🔖 ${task.priority}</span><br>
          <button onclick="editTask(${index})">✏️ Edit</button>
          <button onclick="deleteTask(${index})">🗑️ Delete</button>
        `;

        if (task.completed) completed++;
        container.appendChild(card);
      });

      document.getElementById("taskCounter").innerHTML = `<p>✅ Completed: ${completed} / ${list.length}</p>`;
    }

    document.getElementById("darkToggle").addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
      localStorage.setItem("theme", this.checked ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      document.getElementById("darkToggle").checked = true;
    }

    window.onload = renderTasks;