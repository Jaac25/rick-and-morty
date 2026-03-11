import { CharacterService } from "../services/character.service";
import { fetchCharacters } from "../services/rickMorty.service";

export const seedCharacters = async () => {
  const service = new CharacterService();
  const count = await service.countCharacters();

  if (count > 0) {
    console.log("Characters already seeded");
    return;
  }

  const characters = await fetchCharacters();

  const formatted = characters.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    species: c.species,
    gender: c.gender,
    origin: c.origin?.name,
    image: c.image,
  }));

  await service.createCharacters(formatted);

  console.log("15 characters seeded successfully");
};
