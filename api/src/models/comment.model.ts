import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Character } from "./character.model";

export interface IComment {
  id?: number;
  characterId: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentInstance extends Model<IComment>, IComment {}

export const Comment = sequelize.define<CommentInstance>(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    characterId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

Comment.belongsTo(Character, { foreignKey: "characterId", as: "character" });
Character.hasMany(Comment, { foreignKey: "characterId", as: "comments" });
