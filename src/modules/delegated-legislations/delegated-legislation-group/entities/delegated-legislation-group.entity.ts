import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { DelegatedLegislation } from '../../delegated-legislation/entities/delegated-legislation.entity';

@Table
export class DelegatedLegislationGroup extends Model<DelegatedLegislationGroup> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @HasMany(() => DelegatedLegislation)
  delegatedLegislations: DelegatedLegislation[];
}
