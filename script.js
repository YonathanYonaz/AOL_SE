// Function to get the current date in Month Day, Year format
function getCurrentDate() {
  const currentDate = new Date();
  const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
  ];
  const year = currentDate.getFullYear();
  const month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate();
  return `${month} ${day}, ${year}`;
}

// Display the current date in the paragraph element
if (document.getElementById('current-date')) {
  document.getElementById('current-date').textContent = getCurrentDate();
}

// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render tasks in the table
function renderTasks() {
  const toDoTableBody = document.getElementById('toDoTableBody');
  const doneTableBody = document.getElementById('doneTableBody');
  const taskTableBody = document.getElementById('taskTableBody');

  if (toDoTableBody) toDoTableBody.innerHTML = ''; // Clear existing rows
  if (doneTableBody) doneTableBody.innerHTML = ''; // Clear existing rows
  if (taskTableBody) taskTableBody.innerHTML = ''; // Clear existing rows

  tasks.forEach((task, index) => {
      const row = document.createElement('tr');
      const taskCell = document.createElement('td');
      const dateCell = document.createElement('td');
      const statusCell = document.createElement('td');

      taskCell.textContent = task.description;
      dateCell.textContent = task.dueDate;

      if (taskTableBody) {
          const statusSelect = document.createElement('select');
          const optionToDo = document.createElement('option');
          optionToDo.value = 'To Do';
          optionToDo.textContent = 'To Do';
          const optionDone = document.createElement('option');
          optionDone.value = 'Done';
          optionDone.textContent = 'Done';

          if (task.status === 'To Do') {
              optionToDo.selected = true;
          } else {
              optionDone.selected = true;
          }

          statusSelect.appendChild(optionToDo);
          statusSelect.appendChild(optionDone);
          statusSelect.onchange = function () {
              updateStatus(index, statusSelect.value);
          };

          statusCell.appendChild(statusSelect);
          row.appendChild(taskCell);
          row.appendChild(dateCell);
          row.appendChild(statusCell);
          taskTableBody.appendChild(row);
      } else {
          row.appendChild(taskCell);
          row.appendChild(dateCell);
          if (task.status === 'To Do') {
              toDoTableBody.appendChild(row);
          } else {
              doneTableBody.appendChild(row);
          }
      }
  });
}

// Function to add a new task
function addTask() {
  const newTaskInput = document.getElementById('newTask');
  const newDueDateInput = document.getElementById('newDueDate');
  const newTaskDescription = newTaskInput.value;
  const newTaskDueDate = newDueDateInput.value;
  if (newTaskDescription && newTaskDueDate) {
      tasks.push({ description: newTaskDescription, dueDate: newTaskDueDate, status: 'To Do' });
      newTaskInput.value = '';
      newDueDateInput.value = '';
      saveTasks();
      renderTasks();
  }
}

// Function to update task status
function updateStatus(index, newStatus) {
  tasks[index].status = newStatus;
  saveTasks();
  renderTasks();
}

// Function to show tasks for a specific date
function showTasks(year, month, date) {
  const selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks.forEach(task => {
      if (task.dueDate === selectedDate) {
          const taskItem = document.createElement('li');
          taskItem.textContent = task.description;
          taskList.appendChild(taskItem);
      }
  });
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function showCalendar(month, year) {
  const firstDay = (new Date(year, month)).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  const calendarBody = document.getElementById('calendarBody');
  calendarBody.innerHTML = ''; // Clear previous cells

  let date = 1;
  for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
              const cell = document.createElement('td');
              const cellText = document.createTextNode('');
              cell.appendChild(cellText);
              row.appendChild(cell);
          } else if (date > daysInMonth) {
              break;
          } else {
              const cell = document.createElement('td');
              cell.textContent = date;
              cell.onclick = function () {
                  showTasks(year, month + 1, date);
              };
              row.appendChild(cell);
              date++;
          }
      }

      calendarBody.appendChild(row);
  }

  const calendarMonthYear = document.getElementById('calendarMonthYear');
  if (calendarMonthYear) calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
}

function prevMonth() {
  if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
  } else {
      currentMonth--;
  }
  showCalendar(currentMonth, currentYear);
}

function nextMonth() {
  if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
  } else {
      currentMonth++;
  }
  showCalendar(currentMonth, currentYear);
}

// Function to display current date
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('current-date').textContent = getCurrentDate();
  renderSubmissionTasks();
});

// Function to render tasks for submission
function renderSubmissionTasks() {
  const taskBlocks = document.getElementById('taskBlocks');
  taskBlocks.innerHTML = ''; // Clear previous tasks

  tasks.forEach((task, index) => {
      const taskBlock = document.createElement('div');
      taskBlock.classList.add('task-block');

      const header = document.createElement('header');
      const taskTitle = document.createElement('h3');
      taskTitle.textContent = task.description;
      header.appendChild(taskTitle);

      taskBlock.appendChild(header);

      const attachmentSection = document.createElement('div');
      attachmentSection.classList.add('attachment');

      const fileLabel = document.createElement('label');
      fileLabel.textContent = 'Attach File:';
      attachmentSection.appendChild(fileLabel);

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.name = 'fileUpload';
      attachmentSection.appendChild(fileInput);

      const fileInfo = document.createElement('p');
      fileInfo.textContent = 'No file chosen';
      fileInfo.classList.add('file-info');
      attachmentSection.appendChild(fileInfo);

      const downloadLink = document.createElement('a');
      downloadLink.textContent = 'Download File';
      downloadLink.classList.add('download-link');
      downloadLink.style.display = 'none'; // Initially hide download link
      attachmentSection.appendChild(downloadLink);

      fileInput.addEventListener('change', function() {
          if (fileInput.files.length > 0) {
              const file = fileInput.files[0];
              const fileName = file.name;
              const fileSize = getFileSize(file.size);
              const lastModified = new Date(file.lastModified).toLocaleString();
              fileInfo.textContent = `${fileName} (${fileSize}), Last Modified: ${lastModified}`;
              downloadLink.href = URL.createObjectURL(file);
              downloadLink.setAttribute('download', fileName);
              downloadLink.style.display = 'block'; // Show download link
          } else {
              fileInfo.textContent = 'No file chosen';
              downloadLink.style.display = 'none'; // Hide download link if no file chosen
          }
      });

      taskBlock.appendChild(attachmentSection);

      taskBlocks.appendChild(taskBlock);
  });
}

// Function to convert bytes to a human-readable format
function getFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Initial render of tasks
renderTasks();
showCalendar(currentMonth, currentYear);
