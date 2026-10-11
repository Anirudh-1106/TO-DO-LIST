const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

// In-memory store fallback if MongoDB is not reachable
let memoryTasks = [
  {
    _id: 'mem_1',
    title: 'Welcome to your MERN To-Do App!',
    completed: false,
    createdAt: new Date(),
  },
  {
    _id: 'mem_2',
    title: 'Mark this task as complete by clicking the checkmark',
    completed: true,
    createdAt: new Date(Date.now() - 3600000),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/tasks — fetch all tasks
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.json(tasks);
    }
    // Memory fallback
    res.json(memoryTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// POST /api/tasks — add a new task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (isDbConnected()) {
      const newTask = new Task({
        title: title.trim(),
      });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    }

    // Memory fallback
    const newTask = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    memoryTasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT /api/tasks/:id — update a task (mark complete/incomplete, or edit the title)
router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const { id } = req.params;

    if (isDbConnected() && mongoose.isValidObjectId(id)) {
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (completed !== undefined) updateData.completed = completed;

      const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json(updatedTask);
    }

    // Memory fallback
    const taskIndex = memoryTasks.findIndex((t) => t._id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) memoryTasks[taskIndex].title = title.trim();
    if (completed !== undefined) memoryTasks[taskIndex].completed = completed;

    res.json(memoryTasks[taskIndex]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.isValidObjectId(id)) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.json({ message: 'Task deleted successfully', id });
    }

    // Memory fallback
    const taskIndex = memoryTasks.findIndex((t) => t._id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    memoryTasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
