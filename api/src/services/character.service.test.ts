import { CharacterService, IFilters } from "./character.service";
import { Character } from "../models/character.model";
import { Op } from "sequelize";

jest.mock("../models/character.model");

const mockCharacters = [
  {
    id: 1,
    name: "Rick",
    status: "Alive",
    species: "Human",
    gender: "Male",
    origin: "Earth",
    image: "rick.png",
  },
  {
    id: 2,
    name: "Morty",
    status: "Alive",
    species: "Human",
    gender: "Female",
    origin: "Moon",
    image: "morty.png",
  },
];

describe("CharacterService", () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService();
    jest.clearAllMocks();
  });

  it("countCharacters should call Character.count", async () => {
    (Character.count as jest.Mock).mockResolvedValue(2);
    const count = await service.countCharacters();
    expect(Character.count).toHaveBeenCalled();
    expect(count).toBe(2);
  });

  it("createCharacters should call Character.bulkCreate", async () => {
    (Character.bulkCreate as jest.Mock).mockResolvedValue(mockCharacters);
    const result = await service.createCharacters(mockCharacters);
    expect(Character.bulkCreate).toHaveBeenCalledWith(mockCharacters);
    expect(result).toEqual(mockCharacters);
  });

  it("findCharacters should call Character.findAll with filters", async () => {
    (Character.findAll as jest.Mock).mockImplementation(({ where }) => {
      let filtered = mockCharacters;
      if (where) {
        if (where.name) {
          const nameLike = where.name[Op.like].replace(/%/g, "");
          filtered = filtered.filter((c) => c.name.includes(nameLike));
        }
        if (where.status) {
          filtered = filtered.filter((c) => c.status === where.status[Op.eq]);
        }
        if (where.species) {
          filtered = filtered.filter((c) => c.species === where.species[Op.eq]);
        }
        if (where.gender) {
          filtered = filtered.filter((c) => c.gender === where.gender[Op.eq]);
        }
        if (where.origin) {
          filtered = filtered.filter((c) => c.origin === where.origin[Op.eq]);
        }
      }
      return filtered.map((c) => ({ toJSON: () => c }));
    });

    let filters: IFilters = { name: "Rick" };
    let result = await service.findCharacters(filters);
    expect(Character.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe("Rick");

    filters = { species: "Human" };
    result = await service.findCharacters(filters);
    expect(Character.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);

    filters = { gender: "Female" };
    result = await service.findCharacters(filters);
    expect(Character.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result?.[0]?.name).toBe("Morty");

    filters = { origin: "Marth" };
    result = await service.findCharacters(filters);
    expect(Character.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(0);

    filters = { status: "Alive" };
    result = await service.findCharacters(filters);
    expect(Character.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });
});
