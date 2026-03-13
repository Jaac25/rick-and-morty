import { Op } from "sequelize";
import { ExecutionTime } from "../decorators/executionTime";
import { Character, ICharacter } from "../models/character.model";
import { fetchCharacters } from "./rickMorty.service";

export interface IFilters {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  isFavorite?: boolean;
  orderBy?: string;
  order?: string;
}
export class CharacterService {
  @ExecutionTime
  async countCharacters() {
    return Character.count();
  }

  @ExecutionTime
  async createCharacters(characters: ICharacter[]) {
    return Character.bulkCreate(characters);
  }

  @ExecutionTime
  async updateCharacters() {
    const characters = await fetchCharacters();

    for (const c of characters) {
      await Character.upsert({
        id: c.id,
        name: c.name,
        status: c.status,
        species: c.species,
        gender: c.gender,
        origin: c.origin,
        image: c.image,
      });
    }

    console.log(
      "===========================Characters updated===========================",
    );
  }

  @ExecutionTime
  async findCharacterById(id: string) {
    const result = await Character.findByPk(id);
    return result ? result.toJSON() : null;
  }

  @ExecutionTime
  async findCharacters(args: IFilters) {
    const result = await Character.findAll({
      where: {
        ...(args.name && { name: { [Op.iLike]: `%${args.name}%` } }),
        ...(args.status && { status: { [Op.iLike]: `%${args.status}%` } }),
        ...(args.species && { species: { [Op.iLike]: `%${args.species}%` } }),
        ...(args.gender && { gender: { [Op.iLike]: `%${args.gender}%` } }),
        ...(args.origin && { origin: { [Op.iLike]: `%${args.origin}%` } }),
        ...(args.isFavorite !== undefined && { isFavorite: args.isFavorite }),
      },
      order: [[args.orderBy ?? "name", args.order ?? "ASC"]],
    });
    return result.map((c) => c.toJSON());
  }

  @ExecutionTime
  async updateCharacter({ isFavorite }: Partial<ICharacter>, id: string) {
    const [count] = await Character.update({ isFavorite }, { where: { id } });
    return count > 0;
  }

  @ExecutionTime
  async deleteCharacter(id: string) {
    const count = await Character.destroy({ where: { id } });
    return count > 0;
  }
}
