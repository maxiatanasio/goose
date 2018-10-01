const MongoClient = require('mongodb').MongoClient;

const connect = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_CONNECT_STRING);
        console.log("Connected to database");
        const db = client.db(process.env.MONGO_DB);
        await initColletions(db);
        return db;
    } catch (err) {
        throw err;
    }
}

const initColletions = async (db) => {
    await db.createCollection('notes');
    console.log("Colletions Initialized");
}

module.exports = {
    connect,
    initColletions
}