import { useQuery } from "@apollo/client/react";
import { CommentForm } from "./CommentForm";
import { GET_COMMENTS } from "../graphql/queries/getComments";
import type { IComment } from "../layers/types/requests/comment";
import clsx from "clsx";

export const Comments = ({ characterId }: { characterId: number }) => {
  const { loading: isLoading, data } = useQuery<{ comments: IComment[] }>(
    GET_COMMENTS,
    {
      variables: { characterId },
    },
  );

  const { comments } = data || {};

  let children;
  if (isLoading)
    children = (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col h-20 rounded"></div>
        ))}
      </div>
    );
  else if (!comments?.length) children = <div>There aren't comments</div>;
  else
    children = (
      <ul className="shadow max-h-96 overflow-y-auto p-4 border border-gray-200">
        {comments?.map((desc, i) => (
          <li
            key={desc.id}
            className={clsx(
              "flex flex-row gap-2 p-2 rounded items-center mb-2 line-clamp-5",
              i % 2 === 0 ? "bg-primary100" : "",
            )}
          >
            <span className="h-7 min-w-7 w-7 rounded-full bg-primary600 text-white flex justify-center items-center">
              {i + 1}
            </span>
            <p>{desc.comment}</p>
          </li>
        ))}
      </ul>
    );

  return (
    <div>
      <CommentForm characterId={characterId} />
      <h4 className="text-md font-semibold mb-2">Comments</h4>
      {children}
    </div>
  );
};
