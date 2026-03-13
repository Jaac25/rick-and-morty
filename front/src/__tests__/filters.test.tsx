import { MockedProvider } from "@apollo/client/testing/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Filters, IFilters } from "../components/Filters";
import Index from "../pages/index";
import { GET_CHARACTERS } from "../graphql/queries/getCharacters";
import charactersMock from "../__mocks__/characters.json";

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
  {
    request: {
      query: GET_CHARACTERS,
      variables: {
        name: "snake",
        isFavorite: undefined,
        status: undefined,
        species: undefined,
        gender: undefined,
        order: "ASC",
      },
    },
    result: {
      data: {
        characters: charactersMock.filter(({ name }) =>
          name.toLowerCase().includes("snake"),
        ),
      },
    },
  },
  {
    request: {
      query: GET_CHARACTERS,
      variables: {
        name: "snake",
        isFavorite: false,
        status: "alive",
        species: undefined,
        gender: "male",
        order: "ASC",
      },
    },
    result: {
      data: {
        characters: charactersMock.filter(
          ({ name, status, isFavorite, gender }) =>
            name.toLowerCase().includes("snake") &&
            status === "Alive" &&
            !isFavorite &&
            gender === "Male",
        ),
      },
    },
  },
];

describe("Filters component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const watchMock = jest.fn();
  const setValueMock = jest.fn();

  const defaultValues: IFilters = {
    name: "",
    characters: "all",
    species: "all",
    status: "all",
    gender: "all",
    order: "ASC",
  };

  beforeEach(() => {
    watchMock.mockImplementation(
      (field: keyof IFilters) => defaultValues[field],
    );
  });

  it("should render search input", () => {
    render(<Filters watch={watchMock} setValue={setValueMock} />);

    expect(
      screen.getByPlaceholderText("Search or filter results"),
    ).toBeInTheDocument();
  });

  it("should call setValue when typing in search input", () => {
    render(<Filters watch={watchMock} setValue={setValueMock} />);

    const input = screen.getByPlaceholderText("Search or filter results");

    fireEvent.change(input, { target: { value: "Rick" } });

    expect(setValueMock).toHaveBeenCalledWith("name", "Rick");
  });

  it("Show only characters named snake and alive", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <Index />
      </MockedProvider>,
    );
    const input = await screen.findByPlaceholderText(
      "Search or filter results",
    );
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "snake" } });

    let characters = await screen.findAllByRole("button", {
      name: /snake/i,
    });
    expect(characters).toHaveLength(9);

    const btnFilters = await screen.findByRole("button", {
      name: /open-filters/i,
    });
    expect(btnFilters).toBeInTheDocument();
    fireEvent.click(btnFilters);

    const btnAlive = await screen.findByRole("button", { name: /Alive/i });
    expect(btnAlive).toBeInTheDocument();
    fireEvent.click(btnAlive);

    const btnMale = await screen.findByRole("button", { name: "male" });
    expect(btnMale).toBeInTheDocument();
    fireEvent.click(btnMale);

    const btnOthers = await screen.findByRole("button", { name: /Others/i });
    expect(btnOthers).toBeInTheDocument();
    fireEvent.click(btnOthers);

    characters = await screen.findAllByRole("button", {
      name: /snake/i,
    });
    expect(characters).toHaveLength(2);
  });
});
