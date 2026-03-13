import { CommentService } from "../../services/comment.service";

export const commentResolver = {
  addComment: async (
    _: any,
    { characterId, comment }: { characterId: number; comment: string },
  ) => {
    try {
      const service = new CommentService();
      const newComment = await service.addComment({ characterId, comment });
      return newComment;
    } catch (error) {
      console.error(error);
      throw new Error("Error adding comment");
    }
  },

  comments: async (_: any, { characterId }: { characterId: number }) => {
    try {
      const service = new CommentService();
      const comments = await service.getCommentsByCharacterId(characterId);
      return comments;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching comments");
    }
  },
};
