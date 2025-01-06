import { model, Model, Schema } from 'mongoose';

export interface Post {
    title: string;
    content: string;
    owner: string;
}

const PostSchema: Schema<Post> = new Schema<Post>({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: String,
        required: true,
    },
});

export const PostModel: Model<Post> = model<Post>('Posts', PostSchema);
