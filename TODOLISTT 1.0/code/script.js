const taskInput = document.getElementById('taskInput');
const timeInput = document.getElementById('timeInput');
const taskList = document.getElementById('taskList');
const tabButtons = document.querySelectorAll('.tabs button');

let tasks = [];

function addTask() {
  const text = taskInput.value.trim();
  const time = timeInput.value;

  if (!text || !time) return;

  const task = {
    id: Date.now(),
    text,
    time,
    completed: false,
    delayed: false
  };

  tasks.push(task);
  renderTasks();
  taskInput.value = '';
  timeInput.value = '';
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const taskTime = new Date(task.time);
    const now = new Date();

    task.delayed = !task.completed && taskTime < now;

    if (filter === 'completed' && !task.completed) return;
    if (filter === 'delayed' && !task.delayed) return;

    const li = document.createElement('li');
    li.className = `${task.completed ? 'completed' : ''} ${task.delayed ? 'delayed' : ''}`;

    li.innerHTML = `
      <div class="task-title">${task.text}</div>
      <div class="task-time">⏰ ${taskTime.toLocaleString()}</div>
      <div class="task-actions">
        <button class="done-btn" onclick="markCompleted(${task.id})">Mark Done</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);

    if (task.delayed && !task.alerted) {
      alert(`⚠️ Reminder: "${task.text}" is overdue!`);
      task.alerted = true;
    }
  });
}

function markCompleted(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: true } : t);
  renderTasks(getActiveTab());
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks(getActiveTab());
}

function filterTasks(type) {
  tabButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks(type);
}

function getActiveTab() {
  return document.querySelector('.tabs button.active').textContent.toLowerCase();
}

// Check for reminders every 30 seconds
setInterval(() => renderTasks(getActiveTab()), 30000);
