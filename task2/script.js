const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (taskText !== '') {
    const newTask = {
      text: taskText,
      dueDate: dueDate,
      priority: priority,
      completed: false,
    };

    addTaskToUI(newTask);
    saveTasksToLocalStorage();

    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'medium'; // Reset priority to default
  }
}

function addTaskToUI(task) {
  const newTaskItem = document.createElement('li');
  newTaskItem.textContent = `${task.text} - Due: ${task.dueDate} - Priority: ${task.priority}`;
  newTaskItem.classList.add(task.priority); // Add priority class for styling

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    newTaskItem.classList.toggle('completed', task.completed);
    saveTasksToLocalStorage();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    taskList.removeChild(newTaskItem);
    deleteTaskFromLocalStorage(task);
  });

  newTaskItem.appendChild(checkbox);
  newTaskItem.appendChild(deleteButton);
  taskList.appendChild(newTaskItem);
  newTaskItem.style.opacity = 0;
  newTaskItem.style.transform = 'translateX(20px)';
  setTimeout(() => {
    newTaskItem.style.transition = 'opacity 0.5s, transform 0.5s';
    newTaskItem.style.opacity = 1;
    newTaskItem.style.transform = 'translateX(0)';
  }, 10); 
}

function saveTasksToLocalStorage() {
  const tasks = Array.from(taskList.children).map(taskItem => {
    return {
      text: taskItem.textContent.split(' - Due: ')[0],
      dueDate: taskItem.textContent.split(' - Due: ')[1].split(' - Priority: ')[0],
      priority: taskItem.textContent.split(' - Priority: ')[1],
      completed: taskItem.querySelector('input[type="checkbox"]').checked,
    };
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  storedTasks.forEach(task => {
    addTaskToUI(task);
  });
}

function deleteTaskFromLocalStorage(taskToDelete) {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = storedTasks.filter(task => 
    !(task.text === taskToDelete.text &&
      task.dueDate === taskToDelete.dueDate &&
      task.priority === taskToDelete.priority)
  );
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

addTaskButton.addEventListener('click', addTask);

loadTasksFromLocalStorage();