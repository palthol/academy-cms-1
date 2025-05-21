import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Employee extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public role!: string;
  public hireDate!: Date;
  public salary?: number;
  public payRate?: number; // Hourly rate if not salaried
  public isActive!: boolean;
  public beltRank?: string; // e.g., 'Black Belt', 'Brown Belt'
  public certifications?: string[]; // Array of certifications
  public specialties?: string; // e.g., 'No-Gi, Wrestling, MMA'
  public biography?: string; // For website/marketing
  public emergencyContact?: string;
  public emergencyPhone?: string;
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    beltRank: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    specialties: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
  }
);

export default Employee;