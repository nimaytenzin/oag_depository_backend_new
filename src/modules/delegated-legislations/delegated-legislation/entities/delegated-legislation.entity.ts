import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import {
  DelegatedLegislationType,
  DelegatedLegislationStatus,
} from 'src/constants/enums';
import { DelegatedLegislationGroup } from '../../delegated-legislation-group/entities/delegated-legislation-group.entity';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { DocumentCopy } from 'src/modules/storage/document-copy/entities/document-copy.entity';
import { DelegatedLegislationRelationship } from '../../delegated-legislation-relationship/entities/delegated-legislation-relationship.entity';

@Table
export class DelegatedLegislation extends Model<DelegatedLegislation> {
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
    type: DataType.ENUM,
    values: Object.values(DelegatedLegislationType),
  })
  type: DelegatedLegislationType;

  @Column({
    type: DataType.BIGINT,
  })
  documentYear: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(DelegatedLegislationStatus),
    allowNull: false,
  })
  status: DelegatedLegislationStatus;

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

  @ForeignKey(() => Legislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  legislationId: number;
  @BelongsTo(() => Legislation)
  legislation: Legislation;

  @ForeignKey(() => DelegatedLegislationGroup)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  delegatedLegislationGroupId: number;
  @BelongsTo(() => DelegatedLegislationGroup)
  delegatedLegislationGroup: DelegatedLegislationGroup;

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

  @HasMany(() => DelegatedLegislationRelationship)
  delegatedLegislationRelationships: DelegatedLegislationRelationship[];
}
