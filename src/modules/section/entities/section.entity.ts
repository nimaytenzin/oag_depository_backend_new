import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Legislation } from '../../legislations/legislation/entities/legislation.entity';
import { SectionType } from 'src/constants/enums';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Change } from 'src/modules/change/entities/change.entity';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';

@Table
export class Section extends Model<Section> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  order: number;

  @Column({
    type: DataType.ENUM(...Object.values(SectionType)),
    defaultValue: SectionType.CLAUSE,
    allowNull: false,
  })
  type: SectionType;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: false,
  })
  clause_eng: string;
  @Column({
    type: DataType.TEXT('long'),
    allowNull: false,
  })
  clause_dzo: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  softDelete: boolean;

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
  @BelongsTo(() => DelegatedLegislation)
  delegatedLegislation: DelegatedLegislation;

  @ForeignKey(() => Amendment)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  amendmentId: number;
  @BelongsTo(() => Amendment)
  amendment: Amendment;

  @HasMany(() => Change)
  changes: Change[];
}
