import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Client extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public dateOfBirth!: Date;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public homePhone?: string; // Optional
  public cellPhone!: string;
  public emergencyContact?: string; // Optional
  public emergencyContactPhone?: string; // Optional
  public subscriptionId!: number;

  // Define associations
}

Client.init(
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
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homePhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cellPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'id'
      }
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
  }
);

export default Client;