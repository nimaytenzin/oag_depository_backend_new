import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SectionChangeType, SectionType } from 'src/constants/enums';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { Section } from 'src/modules/section/entities/section.entity';

@Table
export class StashSection extends Model<StashSection> {
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
    type: DataType.ENUM(...Object.values(SectionChangeType)),
    allowNull: false,
  })
  changeType: SectionType;

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

  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  sectionId: number;
  @BelongsTo(() => Section)
  section: Section;
}
