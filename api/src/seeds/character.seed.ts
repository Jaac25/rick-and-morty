import { Character } from "../models/character.model";
import { fetchCharacters } from "../services/rickMorty.service";

export const seedCharacters = async () => {
  const count = await Character.count();

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

  await Character.bulkCreate(formatted);

  console.log("15 characters seeded successfully");
};
