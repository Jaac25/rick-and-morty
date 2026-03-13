import { useState, useRef, useEffect } from "react";
import { Search, SlidersVertical } from "lucide-react";
import clsx from "clsx";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

export interface IFilters {
  name: string;
  characters: CharacterFilter;
  species: SpeciesFilter;
  status: StatusFilter;
  gender: GenderFilter;
  order: OrderFilter;
}

export type CharacterFilter = "all" | "starred" | "others";
export type OrderFilter = "ASC" | "DESC";
export type StatusFilter = "all" | "dead" | "unknown" | "alive";
export type SpeciesFilter =
  | "all"
  | "human"
  | "alien"
  | "mythological"
  | "robot"
  | "animal";
export type GenderFilter = "all" | "female" | "male" | "genderless";

interface Props {
  watch: UseFormWatch<IFilters>;
  setValue: UseFormSetValue<IFilters>;
}

const pill = (active: boolean) =>
  clsx(
    "rounded-lg text-sm h-11 w-24 font-medium transition-colors cursor-pointer capitalize",
    active
      ? "bg-primary100 text-primary600"
      : "hover:bg-gray-50 bg-muted text-muted-foreground hover:bg-accent border border-gray-200",
  );

export const Filters = ({ watch, setValue }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const name = watch("name");
  const characterFilter = watch("characters");
  const status = watch("status");
  const species = watch("species");
  const gender = watch("gender");
  const order = watch("order");

  return (
    <div ref={ref} className="relative">
      <div className="flex h-12 items-center bg-gray-200 gap-2 rounded-lg px-3 py-2">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search or filter results"
          value={name}
          onChange={(e) => setValue("name", e.target.value)}
          className="flex-1 bg-transparent text-sm  outline-none"
        />
        <button
          onClick={() => setOpen(!open)}
          aria-label="open-filters"
          className={clsx(
            "cursor-pointer p-1 transition-colors w-8 h-8 justify-center flex items-center rounded hover:bg-gray-300",
            open && "bg-primary100",
          )}
        >
          <SlidersVertical className="h-4 w-4 text-primary600" />
        </button>
      </div>

      {open && (
        <div className="absolute max-h-96  overflow-y-auto min-h-96 bg-white left-0 right-0 top-full z-20 mt-1 rounded-lg p-4 shadow-lg space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Order</p>
            <div className="grid gap-2 grid-cols-3 justify-evenly">
              {(["ASC", "DESC"] as OrderFilter[]).map((f) => (
                <button
                  key={f}
                  className={pill(order === f)}
                  onClick={() => setValue("order", f)}
                >
                  {f === "ASC" ? "A-Z" : "Z-A"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Character</p>
            <div className="grid grid-cols-3 gap-2 justify-evenly">
              {(["all", "starred", "others"] as CharacterFilter[]).map((f) => (
                <button
                  key={f}
                  className={pill(characterFilter === f)}
                  onClick={() => setValue("characters", f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Status</p>
            <div className="grid grid-cols-3 gap-2 justify-evenly">
              {(["all", "alive", "dead", "unknown"] as StatusFilter[]).map(
                (f) => (
                  <button
                    key={f}
                    className={pill(status === f)}
                    onClick={() => setValue("status", f)}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Specie</p>
            <div className="grid gap-2 grid-cols-3 justify-evenly">
              {(
                [
                  "all",
                  "human",
                  "alien",
                  "mythological",
                  "robot",
                  "animal",
                ] as SpeciesFilter[]
              ).map((f) => (
                <button
                  key={f}
                  className={pill(species === f)}
                  onClick={() => setValue("species", f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Gender</p>
            <div className="grid gap-2 grid-cols-3 justify-evenly">
              {(["all", "female", "male", "genderless"] as GenderFilter[]).map(
                (f) => (
                  <button
                    key={f}
                    className={pill(gender === f)}
                    onClick={() => setValue("gender", f)}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-full rounded-lg hover:bg-primary700 cursor-pointer bg-primary600 text-white py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Filter
          </button>
        </div>
      )}
    </div>
  );
};
