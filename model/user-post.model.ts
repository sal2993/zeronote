import { model, Schema, Model, Document } from 'mongoose';

export interface UserPosts extends Document {
    user_sequencial_id: number,
    user_uuid: string,
    message: string | Array<string>,
    date: Date,
    post_id: string
    tags: Array<string>,
}


const TaskSchema: Schema = new Schema({
    user_sequencial_id: { type: String, required: true },
    user_uuid: { type: String, required: true },
    message: { type: String, required: false },
    date: { type: Date, default: Date.now },
    post_id: { type: String, required: false },
    tags: {type: Array<string>, required: false}
});

export const TaskModel: Model<UserPosts> = model<UserPosts>('todos', TaskSchema);