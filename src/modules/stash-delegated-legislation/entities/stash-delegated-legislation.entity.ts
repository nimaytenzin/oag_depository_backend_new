import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { DelegatedLegislationType, LegislationStatus } from "src/constants/enums";
import { DelegatedLegislation } from "src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity";
import { Legislation } from "src/modules/legislations/legislation/entities/legislation.entity";

@Table
export class StashDelegatedLegislation extends Model<StashDelegatedLegislation>{
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

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique:true
  })
  delegatedLegislationId: number;
  @BelongsTo(() => DelegatedLegislation)
  delegatedLegislation: DelegatedLegislation;
}
