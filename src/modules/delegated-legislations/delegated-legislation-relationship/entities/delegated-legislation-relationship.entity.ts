import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { DelegatedLegislationRelationshipActions } from 'src/constants/enums';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';

@Table
export class DelegatedLegislationRelationship extends Model<DelegatedLegislationRelationship> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  actingDelegatedLegislationId: number;
  @BelongsTo(() => DelegatedLegislation)
  actingDelegatedLegislation: DelegatedLegislation;

  @Column({
    type: DataType.ENUM,
    values: Object.values(DelegatedLegislationRelationshipActions),
    allowNull: false,
  })
  action: DelegatedLegislationRelationshipActions;

  @ForeignKey(() => DelegatedLegislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  affectedDelegatedLegislationId: number;
  @BelongsTo(() => DelegatedLegislation)
  affectedDelegatedLegislation: DelegatedLegislation;
}
