import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { LegislationStatus, LegislationType } from "src/constants/enums";
import { LegislationGroup } from "src/modules/legislations/legislation-group/entities/legislation-group.entity";
import { Legislation } from "src/modules/legislations/legislation/entities/legislation.entity";

@Table
export class StashLegislation extends Model<StashLegislation>{
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

      @ForeignKey(() => LegislationGroup)
      @Column({
        type: DataType.INTEGER,
        allowNull: true,
      })
      legislationGroupId: number;
      @BelongsTo(() => LegislationGroup)
      legislationGroup: LegislationGroup;
    
      @ForeignKey(() => Legislation)
      @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique:true
      })
      legislationId: number;
      @BelongsTo(() => Legislation)
      legislation: Legislation;
}
