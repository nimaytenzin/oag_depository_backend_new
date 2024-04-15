import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';

@Table
export class LegislationGroup extends Model<LegislationGroup> {
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

  @HasMany(() => Legislation)
  legislations: Legislation[];
}
