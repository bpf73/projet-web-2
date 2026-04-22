import sequelize from "../config/database.js";

import User from "./user.js";
import Role from "./role.js";
import Task from "./task.js";
import Course from "./course.js";
import Category from "./category.js";
import TaskCategory from "./taskCategory.js";

// Relations
Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Task);
Task.belongsTo(User);

User.hasMany(Course);
Course.belongsTo(User);

Course.hasMany(Task);
Task.belongsTo(Course);

Task.belongsToMany(Category, { through: TaskCategory });
Category.belongsToMany(Task, { through: TaskCategory });

export {
  sequelize,
  User,
  Role,
  Task,
  Course,
  Category,
  TaskCategory,
};