import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

class Subscription extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public duration!: number; // Duration in months
  public description?: string;
  public classesPerWeek?: number;
  public isUnlimited!: boolean;
  public allowsFreeze!: boolean;
  public freezeLimit?: number; // Days per year allowed to freeze
  public commitmentPeriod?: number; // Minimum months commitment
  public earlyTerminationFee?: number;
  public signupFee?: number;
  public familyPlan!: boolean;
  public maxMembers?: number; // For family plans
  public discountPercent?: number;
  public active!: boolean;
  public accessPrivateClasses!: boolean;
  public accessSpecialEvents!: boolean;
  
// Define associations here if needed

}

Subscription.init(
  {
    // Existing fields
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
    
    // New fields
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    classesPerWeek: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isUnlimited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowsFreeze: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    freezeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commitmentPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    earlyTerminationFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    signupFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    familyPlan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discountPercent: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    accessPrivateClasses: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accessSpecialEvents: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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