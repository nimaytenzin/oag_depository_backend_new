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
  DelegatedLegislationRelationshipActions,
  LegislationRelationshipActions,
  LegislationRelationshipModes,
} from 'src/constants/enums';
import { DelegatedLegislation } from 'src/modules/delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { Legislation } from '../../legislation/entities/legislation.entity';

@Table
export class LegislationRelationship extends Model<LegislationRelationship> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Legislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  actingLegislationId: number;
  @BelongsTo(() => Legislation)
  actingLegislation: Legislation;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LegislationRelationshipActions),
    allowNull: false,
  })
  action: LegislationRelationshipActions;

  @ForeignKey(() => Legislation)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  affectedLegislationId: number;
  @BelongsTo(() => Legislation)
  affectedLegislation: Legislation;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LegislationRelationshipModes),
    allowNull: false,
  })
  mode: LegislationRelationshipModes;
}
