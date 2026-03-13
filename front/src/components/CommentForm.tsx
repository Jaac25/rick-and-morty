import { useMutation } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";
import { ADD_COMMENT } from "../graphql/mutations/addComment";
import clsx from "clsx";
import { ErrorAlert, SuccessAlert } from "./UI/Toast";

export const CommentForm = ({ characterId }: { characterId: number }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useForm({ defaultValues: { comment: "" } });
  const [addComment] = useMutation(ADD_COMMENT);

  const handleSave = handleSubmit(async (data) => {
    try {
      await addComment({
        variables: {
          comment: data.comment,
          characterId,
        },
        refetchQueries: ["GetComments"],
      });
      setValue("comment", "");
      SuccessAlert("Se ha creado el comentario exitosamente");
    } catch (error) {
      console.error(error);
      ErrorAlert("Ha ocurrido un error");
    }
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
      <div className="flex flex-row gap-2 items-center">
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className="w-full border border-gray-200 rounded p-2 mb-2"
            />
          )}
        />
        <button
          disabled={isSubmitting || !isDirty}
          onClick={handleSave}
          className={clsx(
            " text-white px-4 py-2 rounded mb-4 min-h-full",
            !isSubmitting && isDirty
              ? "hover:bg-primary600 bg-primary700 cursor-pointer"
              : "bg-gray-200",
            isSubmitting && "animate-pulse",
          )}
        >
          Save
        </button>
      </div>
    </div>
  );
};
