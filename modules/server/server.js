import Router from  './Router';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const create = () => {
  //todo: fix async issues
  connectToMongo();
  _loadModel();
  return new Router();
}

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_CONNECT_STRING);
}

const _loadModel = () => {
  const modelsDir = __dirname + '/../../models';
  fs.readdirSync(modelsDir).forEach(file => {
    if(file.indexOf('.js')) {
      require(modelsDir + '/' + path.basename(file));
    }
  })
}

module.exports = {
    create
}