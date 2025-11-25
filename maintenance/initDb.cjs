const { MongoClient, ObjectId } = require('mongodb');
const { Chess } = require('chess.js');
require('dotenv').config({
	path: require('path').join(__dirname, '..', '.env'),
});

const GAME_COUNT = 5;

async function initDatabase() {
	const uri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB;

	if (!uri) {
		console.error('ERROR: MONGODB_URI not set in environment');
		process.exit(1);
	}

	console.log(`Connecting to MongoDB...`);
	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Connected successfully to MongoDB');

		const db = client.db(dbName);
		const gamesCollection = db.collection('games');

		// Clear existing games
		const deleteResult = await gamesCollection.deleteMany({});
		console.log(`Deleted ${deleteResult.deletedCount} existing games`);

		// Create new games
		const games = [];
		const chess = new Chess();

		const now = new Date();
		for (let i = 0; i < GAME_COUNT; i++) {
			chess.reset(); // Reset to starting position

			games.push({
				id: i + 1,
				whiteUserIds: [],
				blackUserIds: [],
				history: [
					{
						fen: chess.fen(),
						date: now,
						userId: null,
					},
				],
				createdDate: now,
				lastMoveDate: null,
				currentTurnUserId: null,
				currentTurnStartDate: null,
				result: null,
				drawOfferUserId: null,
			});
		}

		const insertResult = await gamesCollection.insertMany(games);
		console.log(
			`\nSuccessfully inserted ${insertResult.insertedCount} new games`
		);
		console.log(`Database: ${dbName}`);
		console.log(`Collection: games`);

		console.log(`\n✓ Database initialization complete!`);
	} catch (error) {
		console.error('Error initializing database:', error);
		process.exit(1);
	} finally {
		await client.close();
		console.log('MongoDB connection closed');
	}
}

initDatabase();
