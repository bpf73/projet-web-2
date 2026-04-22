import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  role_name: DataTypes.STRING,
});

export default Role;