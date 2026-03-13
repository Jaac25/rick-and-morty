/**
 * @url /comments
 * @method GET
 * @type Response
 */
export interface IComment {
  id: number;
  comment: string;
  characterId: number;
  createdAt: Date;
  updatedAt: Date;
}
