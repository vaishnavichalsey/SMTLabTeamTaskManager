import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    let query = {};

    if (req.user.role === 'admin') {
      if (status) query.status = status;
      if (assignedTo) query.assignedTo = assignedTo;
    } else {
      query.assignedTo = req.user._id;
      if (status) query.status = status;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email');
    console.log("tasks :", tasks);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
    });

    console.log("tasks :", newTask);

    res.status(201).json(newTask);
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status || task.status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
