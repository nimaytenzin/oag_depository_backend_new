import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AnnexureType, DocumentType } from 'src/constants/enums';

@Table
export class Annexure extends Model<Annexure> {
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
  title_eng: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  title_dzo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fileUri_eng: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fileUri_dzo: string;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentType)),
    allowNull: false,
  })
  legislationType: string;
  @Column({
    type: DataType.ENUM(...Object.values(AnnexureType)),
    allowNull: false,
  })
  annexureType: string;

  @Column({
    type: DataType.BIGINT,
  })
  refId: number;
}
