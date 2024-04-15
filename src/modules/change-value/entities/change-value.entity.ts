import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Change } from 'src/modules/change/entities/change.entity';

@Table
export class ChangeValue extends Model<ChangeValue> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  attribute: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  oldValue: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  newValue: string;

  @ForeignKey(() => Change)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  changeId: number;

  @BelongsTo(() => Change, {
    foreignKey: 'changeId',
  })
  change: Change;
}
