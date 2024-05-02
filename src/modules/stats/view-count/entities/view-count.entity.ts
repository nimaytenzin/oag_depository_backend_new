import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { LegislationStatus, LegislationType } from 'src/constants/enums';
import { Section } from '../../../section/entities/section.entity';
import { LegislationGroup } from 'src/modules/legislations/legislation-group/entities/legislation-group.entity';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { DocumentCopy } from 'src/modules/storage/document-copy/entities/document-copy.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
@Table
export class ViewCount extends Model<ViewCount> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

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
  delegatedLegisaltion: DelegatedLegislation;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  browser: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  os: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  screenResolution: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userAgent: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  lat: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  lng: number;
}
