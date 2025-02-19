import { Document, model, Model, Schema, Types } from 'mongoose';

export interface User {
    username: string;
    email: string;
    password: string;
    refreshToken?: string[];
}

const UserSchema: Schema<User> = new Schema<User>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: [String],
        default: undefined
    },
});

export const UserModel: Model<User> = model<User>('Users', UserSchema);

export type UserDocument = User & Document<Types.ObjectId>;
