import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class TrainingSession extends Model {
  public id!: number;
  public clientId!: number;
  public duration!: number;
  public progress!: number;
  public attendance!: boolean;

  // Define associations here if needed
}

TrainingSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    attendance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'training_sessions',
  }
);

export default TrainingSession;