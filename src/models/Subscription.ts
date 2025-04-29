import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Subscription extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public duration!: number; // Duration in months

  // Define associations here if needed
  public static associate(models: any) {
    // Example: Subscription.hasMany(models.Client, { foreignKey: 'subscriptionId' });
  }
}

Subscription.init(
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: true,
  }
);

export default Subscription;