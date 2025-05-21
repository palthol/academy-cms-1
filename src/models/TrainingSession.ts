import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';


class TrainingSession extends Model {
  public id!: number;
  public name!: string;
  public date!: Date;
  public startTime!: Date;
  public endTime!: Date;
  public classType!: string; // e.g., 'BJJ', 'Kickboxing', 'MMA'
  public level!: string; // e.g., 'Beginner', 'Intermediate', 'Advanced'
  public employeeId!: number; // Instructor
  public clientId!: number;
  public attendance!: boolean;
  public notes?: string;
  public location?: string; // Room or mat area
  public maxCapacity?: number; // Maximum number of participants
}

TrainingSession.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    classType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'All Levels',
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    attendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'training_sessions',
    timestamps: true,
  }
);

export default TrainingSession;