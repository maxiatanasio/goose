import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({
    title: String
});

mongoose.model('notes', noteSchema);