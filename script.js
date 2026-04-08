// ========== C# STYLE TODO LIST WITH AUTHENTICATION ==========
class TodoItem {
  constructor(id, text, priority, completed = false, createdAt = null) {
    this.id = id;
    this.text = text;
    this.priority = priority; // 'low', 'medium', 'high'
    this.completed = completed;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

class TodoService {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.loadFromLocalStorage();
  }
  
  // C#-like CRUD operations
  AddTodo(text, priority) {
    if (!text || text.trim() === '') {
      throw new Error('Todo text cannot be empty');
    }
    
    const newTodo = new TodoItem(
      Date.now(),
      text.trim(),
      priority,
      false,
      new Date().toISOString()
    );
    
    this.todos.unshift(newTodo); // Add to beginning
    this.saveToLocalStorage();
    return newTodo;
  }
  
  DeleteTodo(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }
  
  ToggleTodo(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
      return todo;
    }
    return null;
  }
  
  GetTodosByFilter() {
    if (this.currentFilter === 'completed') {
      return this.todos.filter(todo => todo.completed);
    } else if (this.currentFilter === 'pending') {
      return this.todos.filter(todo => !todo.completed);
    }
    return [...this.todos];
  }
  
  GetStats() {
    return {
      total: this.todos.length,
      completed: this.todos.filter(t => t.completed).length,
      pending: this.todos.filter(t => !t.completed).length
    };
  }
  
  SetFilter(filter) {
    this.currentFilter = filter;
  }
  
  saveToLocalStorage() {
    localStorage.setItem('csharp_todo_list', JSON.stringify(this.todos));
  }
  
  loadFromLocalStorage() {
    const saved = localStorage.getItem('csharp_todo_list');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.todos = parsed.map(t => new TodoItem(t.id, t.text, t.priority, t.completed, t.createdAt));
    } else {
      // Add some sample todos
      this.AddTodo('Implement authentication system', 'high');
      this.AddTodo('Write unit tests for Todo service', 'medium');
      this.AddTodo('Review pull requests', 'low');
      this.AddTodo('Deploy to production', 'high');
    }
  }
}

// Authentication Manager (C#-style)
class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.validCredentials = {
      username: 'admin',
      password: 'admin'
    };
  }
  
  Login(username, password) {
    // Simulate server-side validation
    if (username === this.validCredentials.username && 
        password === this.validCredentials.password) {
      this.isAuthenticated = true;
      this.currentUser = { username: username, role: 'admin' };
      localStorage.setItem('todo_auth', JSON.stringify({ isAuthenticated: true, username: username }));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid credentials. Use admin/admin' };
  }
  
  Logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('todo_auth');
  }
  
  CheckAuth() {
    const savedAuth = localStorage.getItem('todo_auth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      if (auth.isAuthenticated && auth.username === 'admin') {
        this.isAuthenticated = true;
        this.currentUser = { username: auth.username, role: 'admin' };
        return true;
      }
    }
    return false;
  }
}

// Initialize Todo App
(function initTodoApp() {
  const todoService = new TodoService();
  const authManager = new AuthManager();
  
  const loginForm = document.getElementById('loginForm');
  const todoApp = document.getElementById('todoApp');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const newTodoInput = document.getElementById('newTodoInput');
  const todoPriority = document.getElementById('todoPriority');
  const todoList = document.getElementById('todoList');
  const loginError = document.getElementById('loginError');
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');
  
  // Stats elements
  const totalTasksSpan = document.getElementById('totalTasks');
  const completedTasksSpan = document.getElementById('completedTasks');
  const pendingTasksSpan = document.getElementById('pendingTasks');
  
  // Check for existing session
  if (authManager.CheckAuth()) {
    showTodoApp();
  }
  
  // Login handler
  loginBtn.addEventListener('click', () => {
    const username = loginUsername.value;
    const password = loginPassword.value;
    
    const result = authManager.Login(username, password);
    
    if (result.success) {
      showTodoApp();
      loginError.classList.add('hidden');
      loginUsername.value = '';
      loginPassword.value = '';
    } else {
      loginError.textContent = result.message;
      loginError.classList.remove('hidden');
      
      // Shake animation for error
      loginError.style.animation = 'shake 0.5s ease';
      setTimeout(() => {
        loginError.style.animation = '';
      }, 500);
    }
  });
  
  // Add shake animation
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(shakeStyle);
  
  // Enter key on password field
  loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
  
  // Logout handler
  logoutBtn.addEventListener('click', () => {
    authManager.Logout();
    showLoginForm();
    todoService.todos = [];
    todoService.loadFromLocalStorage();
    renderTodoList();
  });
  
  // Add todo handler
  addTodoBtn.addEventListener('click', () => {
    const text = newTodoInput.value;
    const priority = todoPriority.value;
    
    if (text.trim() === '') {
      showNotification('Please enter a task!', 'error');
      newTodoInput.style.borderColor = '#dc3545';
      setTimeout(() => {
        newTodoInput.style.borderColor = '';
      }, 2000);
      return;
    }
    
    try {
      todoService.AddTodo(text, priority);
      newTodoInput.value = '';
      renderTodoList();
      updateStats();
      showNotification('Task added successfully!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
  
  // Enter key on todo input
  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodoBtn.click();
    }
  });
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      todoService.SetFilter(filter);
      renderTodoList();
    });
  });
  
  function showTodoApp() {
    loginForm.classList.add('hidden');
    todoApp.classList.remove('hidden');
    renderTodoList();
    updateStats();
    showNotification('Welcome back, Admin!', 'success');
  }
  
  function showLoginForm() {
    loginForm.classList.remove('hidden');
    todoApp.classList.add('hidden');
  }
  
  function renderTodoList() {
    const todos = todoService.GetTodosByFilter();
    
    if (todos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          <p>📭 No tasks found</p>
          <small>Add a new task to get started!</small>
        </div>
      `;
      return;
    }
    
    todoList.innerHTML = todos.map(todo => `
      <div class="todo-item" data-id="${todo.id}">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <div class="todo-content">
          <div class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.text)}</div>
          <div class="todo-meta">
            <span class="priority-badge priority-${todo.priority}">
              ${getPriorityIcon(todo.priority)} ${todo.priority.toUpperCase()}
            </span>
            <span class="todo-date">📅 ${formatDate(todo.createdAt)}</span>
          </div>
        </div>
        <button class="delete-todo" data-id="${todo.id}">🗑️</button>
      </div>
    `).join('');
    
    // Add event listeners to checkboxes and delete buttons
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const todoItem = e.target.closest('.todo-item');
        const id = parseInt(todoItem.getAttribute('data-id'));
        todoService.ToggleTodo(id);
        renderTodoList();
        updateStats();
        showNotification('Task status updated!', 'info');
      });
    });
    
    document.querySelectorAll('.delete-todo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Delete this task?')) {
          todoService.DeleteTodo(id);
          renderTodoList();
          updateStats();
          showNotification('Task deleted!', 'success');
        }
      });
    });
  }
  
  function updateStats() {
    const stats = todoService.GetStats();
    totalTasksSpan.textContent = stats.total;
    completedTasksSpan.textContent = stats.completed;
    pendingTasksSpan.textContent = stats.pending;
  }
  
  function getPriorityIcon(priority) {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `todo-notification todo-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
      color: white;
      border-radius: 8px;
      font-size: 0.9rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(notificationStyle);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Add slide out animation
  const slideOutStyle = document.createElement('style');
  slideOutStyle.textContent = `
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(slideOutStyle);
})();
