import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Subscription from './Subscription';

class Client extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public subscriptionId!: number;

  // Define associations
  public static associate() {
    Client.belongsTo(Subscription, {
      foreignKey: 'subscriptionId',
      as: 'subscription',
    });
  }
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
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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