import { MockedProvider } from "@apollo/client/testing/react";
import { fireEvent, render, screen } from "@testing-library/react";
import charactersMock from "../__mocks__/characters.json";
import { GET_CHARACTERS } from "../graphql/queries/getCharacters";
import Index from "../pages/index";

const mocks = [
  {
    request: {
      query: GET_CHARACTERS,
      variables: {
        name: undefined,
        isFavorite: undefined,
        status: undefined,
        species: undefined,
        gender: undefined,
        order: "ASC",
      },
    },
    result: { data: { characters: charactersMock } },
  },
];

describe("Index page", () => {
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks}>
        <Index />
      </MockedProvider>,
    );
  });
  it("renders Rick and Morty list", async () => {
    const title = await screen.findByText(/Rick and Morty list/i);
    expect(title).toBeInTheDocument();
    const selectCharacterText = await screen.findByText(/Select a character/i);
    expect(selectCharacterText).toBeInTheDocument();
  });

  it("shows character detail when a character is clicked", async () => {
    const characters = await screen.findAllByRole("button", { name: /snake/i });
    expect(characters).toHaveLength(9);
    const character = characters.at(0) as HTMLButtonElement;
    fireEvent.click(character);

    const btnFavorite = await screen.findByRole("button", {
      name: /toggle favorite/i,
    });
    expect(btnFavorite).toBeInTheDocument();
    const btnDelete = await screen.findByRole("button", { name: /Delete/i });
    expect(btnDelete).toBeInTheDocument();
  });
});
