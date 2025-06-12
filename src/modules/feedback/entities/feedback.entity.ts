import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Feedback extends Model<Feedback> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    text: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    ip: string;
}
