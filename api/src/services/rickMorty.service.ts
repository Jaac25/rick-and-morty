import axios from "axios";

interface ICharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: [string];
  url: string;
  created: string;
}

interface ICharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: ICharacter[];
}

export const fetchCharacters = async () => {
  try {
    const response = await axios.get<ICharacterResponse>(
      "https://rickandmortyapi.com/api/character?count=15",
    );
    return response.data.results.slice(0, 15);
  } catch (error) {
    throw new Error("Failed to fetch characters");
  }
};
