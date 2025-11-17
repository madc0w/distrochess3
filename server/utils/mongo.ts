import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
	if (db) return db;
	const uri = process.env.MONGODB_URI || process.env.NITRO_MONGODB_URI;
	if (!uri) {
		throw new Error('MONGODB_URI is not set in environment');
	}
	client = new MongoClient(uri);
	await client.connect();
	db = client.db(process.env.MONGODB_DB || 'distrochess3');
	return db;
}
