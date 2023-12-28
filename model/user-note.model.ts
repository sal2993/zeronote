import { model, Schema, models, Document, Types } from 'mongoose';

export interface UserNoteType extends Document {
    user_uuid: Types.ObjectId,
    email: string,
    note: string | Array<string>,
    date: Date,
    post_id: Types.ObjectId
    location: object,
    tags: Array<string>,
}


const UserNoteSchema: Schema = new Schema({
    user_uuid: { type: Schema.Types.ObjectId, ref: 'user_id', required: true },
    email: { type: String, required: true },
    note: { type: String, required: true },
    date: { type: Date, default: Date.now },
    post_id: { type: Schema.Types.ObjectId, ref: 'post_id',required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        required: false
    },
    tags: {type: Array<string>, required: false}
});

export const UserNote = models.UserNote || model<UserNoteType>('UserNote', UserNoteSchema);