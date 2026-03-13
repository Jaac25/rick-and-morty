import { useMutation } from "@apollo/client/react";
import clsx from "clsx";
import { ArrowLeft, Heart } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { TOGGLE_FAVORITE } from "../graphql/mutations/toggleFavorite";
import type { ICharacter } from "../layers/types/requests/character";
import { ErrorAlert, SuccessAlert } from "./UI/Toast";
import { Comments } from "./Comments";
import { DELETE_CHARACTER } from "../graphql/mutations/deleteCharacter";

interface Props {
  character: ICharacter;
  onBack?: () => void;
  setSelected: Dispatch<SetStateAction<ICharacter | undefined>>;
}
export const CharacterDetail = ({ character, onBack, setSelected }: Props) => {
  const isFavorite = character.isFavorite;

  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const [deleteCharacter] = useMutation(DELETE_CHARACTER);
  const [showConfirm, setShowConfirm] = useState(false);

  const onToggleFavorite = async () => {
    try {
      await toggleFavorite({
        variables: {
          id: character.id,
          isFavorite: !isFavorite,
        },
        refetchQueries: ["GetCharacters"],
      });
      SuccessAlert(
        isFavorite
          ? "El personaje ya no es favorito :("
          : "El personaje ha sido configurado como favorito",
      );
      onBack?.();
      setSelected?.(undefined);
    } catch (error) {
      console.error(error);
      ErrorAlert("Ha ocurrido un error");
    }
  };

  const handleDeleteCharacter = async () => {
    try {
      await deleteCharacter({
        variables: {
          id: character.id,
        },
        refetchQueries: ["GetCharacters"],
      });
      SuccessAlert("El personaje ha sido borrado exitosamente");
      onBack?.();
      setSelected?.(undefined);
    } catch (error) {
      console.error(error);
      ErrorAlert("Ha ocurrido un error");
    }
    setShowConfirm(false);
  };

  return (
    <div className="flex h-full gap-4 flex-col">
      {onBack && (
        <button
          onClick={onBack}
          className=" cursor-pointer mb-4 flex items-center gap-1 text-primary md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      <div className="flex flex-col items-start gap-1">
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <button
            onClick={onToggleFavorite}
            className="absolute -bottom-1 -right-1"
            aria-label="Toggle favorite"
            title={isFavorite ? "Borrar Favorito" : "Activar Favorito"}
          >
            <div
              className={clsx(
                isFavorite && "bg-white",
                "cursor-pointer hover:scale-105 rounded-full w-8 h-8 p-1",
              )}
            >
              <Heart
                className={clsx(
                  "h-6 w-6 transition-colors  stroke-gray-300 ",
                  isFavorite
                    ? "fill-secondary600 text-secondary600"
                    : "animate-bounce hover:animate-none fill-white hover:fill-secondary600",
                )}
              />
            </div>
          </button>
        </div>
        <h2 className="mt-3 text-2xl font-bold ">{character.name}</h2>
      </div>

      <div className="mt-6">
        {[
          { label: "Specie", value: `${character.species}` },
          { label: "Status", value: `${character.status}` },
          { label: "Gender", value: `${character.gender}` },
          { label: "Origin", value: `${character.origin}` },
        ].map((row, idx, arr) => (
          <div key={idx}>
            <DetailRow key={row.label} label={row.label} value={row.value} />
            {idx < arr.length - 1 && (
              <div className="w-full h-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <Comments characterId={character.id} />

      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-500 hover:bg-red-200 p-4 rounded cursor-pointer text-white self-center "
      >
        Delete Character
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <p className="mb-4 text-lg">
              Are you sure you want to delete the character?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteCharacter}
                className="cursor-pointer bg-red-500 hover:bg-red-200 text-white px-4 py-2 rounded"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer bg-gray-300 hover:bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="py-4" />
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="py-4">
    <p className="text-sm font-medium ">{label}</p>
    <p className="text-sm ">{value}</p>
  </div>
);
