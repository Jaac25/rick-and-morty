import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface ICharacter {
  id: number;
  name: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CharacterInstance extends Model<ICharacter>, ICharacter {}

export const Character = sequelize.define<CharacterInstance>(
  "characters",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    species: DataTypes.STRING,
    gender: DataTypes.STRING,
    origin: DataTypes.STRING,
    image: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);
