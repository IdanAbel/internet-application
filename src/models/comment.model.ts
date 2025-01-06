import { model, Model, Schema } from 'mongoose';

export interface Comment {
    comment: string;
    owner: string;
    postId: string;
}

const CommentSchema: Schema<Comment> = new Schema<Comment>({
    comment: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
});

export const CommentModel: Model<Comment> = model<Comment>('Comments', CommentSchema);
