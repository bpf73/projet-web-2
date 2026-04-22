import { Task } from "../models/index.js";

export const createTask = async (req, res) => {
    
  const { title, description, status } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    UserId: req.user.id 
  });

  res.json(task);
};

export const getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const offset = (page - 1) * limit;

  const tasks = await Task.findAll({
    where: { UserId: req.user.id },
    limit: limit,
    offset: offset
  });

  res.json(tasks);
};

export const deleteTask = async (req, res) => {
  const id = req.params.id;

  await Task.destroy({
    where: { id }
  });

  res.json({ message: "Task deleted" });
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  await Task.update(
    { title, description, status },
    { where: { id } }
  );

  res.json({ message: "Task updated" });
};