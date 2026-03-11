import axios from "axios";

export const characterResolver = {
  characters: async (_: any, args: { name?: string }) => {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/character",
    );

    let characters = response.data.results;

    console.log({ args });
    if (args.name) {
      characters = characters.filter((c: any) =>
        c.name.toLowerCase().includes(args.name!.toLowerCase()),
      );
    }

    return characters;
  },
};
