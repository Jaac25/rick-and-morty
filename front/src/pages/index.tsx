import { useQuery } from "@apollo/client/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CharacterDetail } from "../components/CharacterDetail";
import { CharacterList } from "../components/CharacterList";
import { Filters, type IFilters } from "../components/Filters";
import { Skeleton } from "../components/Skeleton";
import { GET_CHARACTERS } from "../graphql/queries/getCharacters";
import type { ICharacter } from "../layers/types/requests/character";
import { useDebounce } from "../hooks/useDebounce";

const Index = () => {
  const [selected, setSelected] = useState<ICharacter | undefined>();
  const [showDetail, setShowDetail] = useState(false);

  const { setValue, watch, control } = useForm<IFilters>({
    defaultValues: {
      characters: "all",
      species: "all",
      name: "",
      status: "all",
      gender: "all",
      order: "ASC",
    },
  });

  const textName = useWatch({ control, name: "name" });
  const name = useDebounce({ value: textName });
  const charactersFilter = useWatch({ control, name: "characters" });
  const species = useWatch({ control, name: "species" });
  const statusFilter = useWatch({ control, name: "status" });
  const gender = useWatch({ control, name: "gender" });
  const order = useWatch({ control, name: "order" });

  const filters = useMemo(
    () => ({
      name,
      characters: charactersFilter,
      species,
      status: statusFilter,
      gender,
    }),
    [statusFilter, charactersFilter, name, species, gender],
  );

  const {
    loading: isLoading,
    error,
    data,
  } = useQuery<{ characters: ICharacter[] }>(GET_CHARACTERS, {
    variables: {
      name: name ? name : undefined,
      isFavorite:
        charactersFilter === "all" ? undefined : charactersFilter === "starred",
      status: statusFilter === "all" ? undefined : statusFilter,
      species: species === "all" ? undefined : species,
      gender: gender === "all" ? undefined : gender,
      order,
    },
  });

  const { characters } = data || {};

  const starred = useMemo(
    () => characters?.filter(({ isFavorite }) => isFavorite) ?? [],
    [characters],
  );

  const rest = useMemo(
    () => characters?.filter(({ isFavorite }) => !isFavorite) ?? [],
    [characters],
  );

  const character = useMemo(
    () => characters?.find((c) => c.id === selected?.id),
    [selected, characters],
  );

  const handleSelect = (character: ICharacter) => {
    setSelected(character);
    setShowDetail(true);
  };

  const filtersCount = useMemo(() => {
    return Object.values(filters).reduce((prev, cur) => {
      const haveFilter = cur !== "all" && cur !== "" ? 1 : 0;
      return prev + haveFilter;
    }, 0);
  }, [filters]);

  const showStarred =
    charactersFilter === "all" || charactersFilter === "starred";
  const showOther = charactersFilter === "all" || charactersFilter === "others";

  let lists;
  if (isLoading)
    lists = (
      <div className="space-y-2 p-2 flex flex-col ">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  else if (error)
    lists = (
      <div className="justify-center items-center flex w-full h-full">
        No info
      </div>
    );
  else
    lists = (
      <div className="flex flex-col p-2 min-h-full">
        {!!starred.length && showStarred && (
          <CharacterList
            className={clsx(
              "h-min",
              !showOther ? "max-h-3/4" : "max-h-1/2 h-min",
            )}
            list={starred}
            title="STARRED CHARACTERS"
            selected={character}
            setSelected={handleSelect}
          />
        )}
        {showOther && (
          <CharacterList
            list={rest}
            className={clsx("h-min", !showStarred ? "max-h-3/4" : "max-h-1/2")}
            title="CHARACTERS"
            selected={character}
            setSelected={handleSelect}
          />
        )}
      </div>
    );

  const showFiltersResume = Object.values(filters).some(
    (v) => v !== "all" && v !== "",
  );

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <div
        className={clsx(
          "flex w-full bg-gray-50 flex-col h-full md:max-w-95 md:min-w-95",
          showDetail ? "hidden md:flex" : "flex",
        )}
      >
        <div className="p-2">
          <h1 className="p-2 text-xl font-bold">Rick and Morty list</h1>
          <Filters watch={watch} setValue={setValue} />
          {showFiltersResume && (
            <div className="mt-3 flex items-center justify-between px-6">
              <span className="text-sm font-medium text-blue-500">
                {characters?.length} Results
              </span>
              {!!filtersCount && (
                <div className=" bg-[#63D83833] px-4 py-1 rounded-xl text-green-700 text-xs font-semibold">
                  {filtersCount} Filter{filtersCount > 1 && "s"}
                </div>
              )}
            </div>
          )}
        </div>

        {lists}
      </div>

      <div
        className={clsx(
          "w-full overflow-y-auto shadow h-full p-6 md:p-10",
          showDetail ? "flex flex-col" : "hidden md:flex md:flex-col",
        )}
      >
        {selected ? (
          <CharacterDetail
            character={selected}
            setSelected={setSelected}
            onBack={() => setShowDetail(false)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-black">
            Select a character
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
