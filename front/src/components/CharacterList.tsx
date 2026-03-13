import clsx from "clsx";
import { Heart } from "lucide-react";
import type { ICharacter } from "../layers/types/requests/character";

interface Props {
  character: ICharacter;
  isSelected: boolean;
  onSelect: () => void;
}

export const CharacterList = ({
  title,
  list,
  selected,
  setSelected,
  className,
}: {
  title: string;
  list: ICharacter[];
  selected?: ICharacter | null;
  setSelected: (character: ICharacter) => void;
  className?: string;
}) => {
  return (
    <div className={clsx("flex flex-col h-full gap-2", className)}>
      <p className="px-3 py-2 text-xs font-semibold tracking-wider">
        {title} ({list.length})
      </p>
      <div className="flex flex-col overflow-y-auto gap-1">
        {list.map((c) => (
          <CharacterListItem
            key={c.id}
            character={c}
            isSelected={selected?.id === c.id}
            onSelect={() => setSelected(c)}
          />
        ))}
      </div>
    </div>
  );
};

const CharacterListItem = ({ character, isSelected, onSelect }: Props) => {
  const isFavorite = character.isFavorite;
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer text-left transition-colors",
        isSelected ? "bg-primary100" : "hover:bg-primary100 ",
      )}
    >
      <img
        src={character.image}
        alt={character.name}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{character.name}</p>
        <p className="text-xs">{character.species}</p>
      </div>

      <div
        key={character.id}
        className={clsx(isFavorite && "bg-white", " rounded-full w-8 h-8 p-1")}
      >
        <Heart
          className={clsx(
            "h-6 w-6 transition-colors stroke-gray-300",
            isFavorite && "fill-secondary600 text-secondary600",
          )}
        />
      </div>
    </button>
  );
};
