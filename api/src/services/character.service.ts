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
        origin: c.origin?.name,
        image: c.image,
      });
    }

    console.log(
      "===========================Characters updated===========================",
    );
  }

  @ExecutionTime
  async findCharacters(args: IFilters) {
    const result = await Character.findAll({
      where: {
        ...(args.name && { name: { [Op.like]: `%${args.name}%` } }),
        ...(args.status && { status: { [Op.eq]: args.status } }),
        ...(args.species && { species: { [Op.eq]: args.species } }),
        ...(args.gender && { gender: { [Op.eq]: args.gender } }),
        ...(args.origin && { origin: { [Op.eq]: args.origin } }),
      },
    });
    return result.map((c) => c.toJSON());
  }
}
