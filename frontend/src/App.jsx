import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [error, setError] = useState(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch tasks from server');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setError(null);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (!res.ok) throw new Error('Failed to add task');
      const savedTask = await res.json();
      setTasks([savedTask, ...tasks]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Toggle completion status
  const handleToggleComplete = async (task) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error('Failed to update task status');
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  // Save edited task title
  const handleSaveEdit = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      setError(null);
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });

      if (!res.ok) throw new Error('Failed to update task title');
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      setEditingId(null);
      setEditingTitle('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">Task Manager</h1>
          <span className="badge">MERN Stack</span>
        </div>
        <p className="app-subtitle">Stay organized and get things done effortlessly</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          id="task-input"
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button id="add-task-btn" type="submit" className="btn-add" disabled={!newTitle.trim()}>
          <span>Add Task</span>
        </button>
      </form>

      {/* Filter and Stats Bar */}
      <div className="status-bar">
        <div className="filter-group">
          <button
            id="filter-all"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            id="filter-active"
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            id="filter-completed"
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
        <div className="stats-count">
          {activeCount} remaining
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="loading-state">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>
            {filter === 'completed'
              ? 'No completed tasks yet.'
              : filter === 'active'
              ? 'No active tasks. You are all caught up!'
              : 'No tasks yet. Add one above to get started!'}
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
              id={`task-item-${task._id}`}
            >
              <div className="task-content">
                <button
                  type="button"
                  className={`task-checkbox-custom ${task.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleComplete(task)}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  id={`checkbox-${task._id}`}
                >
                  {task.completed && (
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>

                {editingId === task._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(task._id);
                    }}
                    className="edit-form"
                  >
                    <input
                      type="text"
                      className="edit-input"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                    />
                  </form>
                ) : (
                  <div className="task-info">
                    <span className={`task-title ${task.completed ? 'done' : ''}`}>
                      {task.title}
                    </span>
                    <span className="task-date">
                      {new Date(task.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="task-actions">
                {editingId === task._id ? (
                  <>
                    <button
                      type="button"
                      className="btn-icon save"
                      onClick={() => handleSaveEdit(task._id)}
                      title="Save"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setEditingId(null)}
                      title="Cancel"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleStartEdit(task)}
                      title="Edit title"
                      id={`edit-btn-${task._id}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                      id={`delete-btn-${task._id}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
