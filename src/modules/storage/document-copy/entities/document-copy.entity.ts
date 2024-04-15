import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import {
  DocumentStatus,
  DocumentType,
  LanguageType,
} from 'src/constants/enums';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';

@Table
export class DocumentCopy extends Model<DocumentCopy> {
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
  fileUri: string;

  @Column({
    type: DataType.ENUM(...Object.values(LanguageType)),
    allowNull: false,
  })
  language: string;

  @ForeignKey(() => Legislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  legislationId: number;
  @BelongsTo(() => Legislation)
  legislation: Legislation;

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  delegatedLegislationId: number;
  @BelongsTo(() => Legislation)
  delegatedLegislation: DelegatedLegislation;

  @ForeignKey(() => Amendment)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  amendmentId: number;
  @BelongsTo(() => Amendment)
  amendment: Amendment;
}
