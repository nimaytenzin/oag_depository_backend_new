import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ParentDocumentType } from 'src/constants/enums';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';

@Table
export class ParentDocument extends Model<ParentDocument> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ParentDocumentType),
    allowNull: false,
  })
  type: ParentDocumentType;

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
    type: DataType.DATEONLY,
    allowNull: true,
  })
  date: string;

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  delegatedLegislationId: number;
  @BelongsTo(() => DelegatedLegislation)
  delegatedLegislation: DelegatedLegislation;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fileUri: string;
}
