import {connect} from './../database';
import mongoose from 'mongoose';

const getAll = async (req,res) => {
    const notes = await mongoose.model('notes').find({}).exec();
    res.write(JSON.stringify(notes));
}

export default {
    getAll
}