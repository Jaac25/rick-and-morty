/**
 * @url /characters
 * @method GET
 * @type Response
 */
export interface ICharacter {
  id: number;
  name: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorite?: boolean;
  comments: IComment[];
}

interface IComment {
  id: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
