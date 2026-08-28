const STORAGE_KEY = "todos";
const THEME_KEY = "theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");

// "pink" is the default theme (bright pink background); "dark" is the alternative.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "pink";
  const next = current === "dark" ? "pink" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

applyTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "pink");

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const todos = loadTodos();
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-message";
    empty.textContent = "No tasks yet. Add one above!";
    list.appendChild(empty);
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " completed" : "");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = todo.text;
    span.addEventListener("click", () => toggleTodo(todo.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ id: Date.now().toString(), text, done: false });
  saveTodos(todos);
  render();
}

function toggleTodo(id) {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos(todos);
    render();
  }
}

function deleteTodo(id) {
  const todos = loadTodos().filter((t) => t.id !== id);
  saveTodos(todos);
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  addTodo(text);
  input.value = "";
  input.focus();
});

render();
