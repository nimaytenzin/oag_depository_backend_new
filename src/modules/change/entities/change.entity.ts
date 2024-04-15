import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { SectionChangeType } from 'src/constants/enums';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { ChangeValue } from 'src/modules/change-value/entities/change-value.entity';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { Section } from 'src/modules/section/entities/section.entity';

@Table
export class Change extends Model<Change> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(SectionChangeType)),
    allowNull: false,
  })
  changeType: string;

  @ForeignKey(() => Section)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  sectionId: number;
  @BelongsTo(() => Section, {
    foreignKey: 'sectionId',
  })
  section: Section;

  @ForeignKey(() => Legislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  legislationId: number;
  @BelongsTo(() => Legislation, {
    foreignKey: 'legislationId',
  })
  legislation: Legislation;

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  delegatedLegislationId: number;
  @BelongsTo(() => DelegatedLegislation, {
    foreignKey: 'delegatedLegislationId',
  })
  delegatedLegislation: DelegatedLegislation;

  @HasMany(() => ChangeValue)
  changeValues: ChangeValue[];

  @ForeignKey(() => Amendment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amendmentId: number;
  @BelongsTo(() => Amendment, {
    foreignKey: 'amendmentId',
  })
  amendment: Amendment;
}
