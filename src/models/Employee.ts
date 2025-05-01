import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Employee extends Model {
  public id!: number;
  public name!: string;
  public role!: string;
  public schedule!: string;

  // Define associations here if needed
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);

export default Employee;