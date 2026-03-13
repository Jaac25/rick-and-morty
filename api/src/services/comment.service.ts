import { ExecutionTime } from "../decorators/executionTime";
import { Comment, IComment } from "../models/comment.model";

export class CommentService {
  @ExecutionTime
  async addComment({ characterId, comment }: IComment) {
    const newComment = await Comment.create({
      characterId,
      comment,
    });
    return newComment.toJSON();
  }

  @ExecutionTime
  async getCommentsByCharacterId(characterId: number) {
    const comments = await Comment.findAll({
      where: { characterId },
      order: [["createdAt", "DESC"]],
    });
    return comments.map((c) => c.toJSON());
  }
}
