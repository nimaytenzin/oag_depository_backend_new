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
import { LegislationRelationship } from '../../legislation-relationship/entities/legislation-relationship.entity';
@Table
export class Legislation extends Model<Legislation> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  title_eng: string;

  @Column({
    type: DataType.STRING,
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
    type: DataType.DATEONLY,
    allowNull: true,
  })
  tabledDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  enactmentDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  commencementDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  amendmentDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  repealDate: string;

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
    type: DataType.ENUM,
    values: Object.values(LegislationType),
    defaultValue: LegislationType.ACT,
  })
  type: LegislationType;

  @HasMany(() => Section)
  section: Section[];

  @HasMany(() => DelegatedLegislation)
  delegatedLegislations: DelegatedLegislation;

  @ForeignKey(() => LegislationGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  legislationGroupId: number;
  @BelongsTo(() => LegislationGroup)
  legislationGroup: LegislationGroup;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  creatorId: number;
  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Amendment)
  amendments: Amendment[];

  @HasMany(() => DocumentCopy)
  documentCopies: DocumentCopy[];

  @HasMany(() => LegislationRelationship)
  legislationRelationships: LegislationRelationship[];
}
