import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { LegislationStatus } from 'src/constants/enums';
import { Change } from 'src/modules/change/entities/change.entity';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { Section } from 'src/modules/section/entities/section.entity';
import { DocumentCopy } from 'src/modules/storage/document-copy/entities/document-copy.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Amendment extends Model<Amendment> {
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
  delegatedLegislation: DelegatedLegislation;

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
    type: DataType.BIGINT,
  })
  documentYear: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LegislationStatus),
    allowNull: false,
  })
  status: LegislationStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isPublished: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  enactmentDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  commencementDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  repealDate: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;
  @BelongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: User;

  @HasMany(() => Change)
  changes: Change[];

  @HasMany(() => Section)
  sections: Section[];

  @HasMany(() => DocumentCopy)
  documentCopies: DocumentCopy[];
}
