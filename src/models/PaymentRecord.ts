import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';


class PaymentRecord extends Model {
  public id!: number;
  public clientId!: number;
  public amount!: number;
  public date!: Date;
  public status!: string;

}

PaymentRecord.init(
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payment_records',
  }
);

export default PaymentRecord;