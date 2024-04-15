import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { USERROLES } from './../../../constants/enums';

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column
  password: string;

  @Column(DataType.STRING)
  fullName: string;

  @Column(DataType.ENUM(...Object.values(USERROLES)))
  role: string;
}
