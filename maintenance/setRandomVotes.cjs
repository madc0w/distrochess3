const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

async function setRandomVotes() {
	const uri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB;

	if (!uri) {
		console.error('ERROR: MONGODB_URI not set in environment');
		process.exit(1);
	}

	// Load image metadata
	const metadataPath = path.join(
		__dirname,
		'..',
		'server',
		'assets',
		'image-metadata.json'
	);
	const imageMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
	console.log(
		`Loaded ${imageMetadata.length} entries from image-metadata.json`
	);

	console.log(`Connecting to MongoDB...`);
	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Connected successfully to MongoDB');

		const db = client.db(dbName);
		const collection = db.collection('imageSelectionCounts');

		// Get all existing publicIds from the collection
		const existingDocs = await collection
			.find({}, { projection: { publicId: 1 } })
			.toArray();
		const existingPublicIds = new Set(existingDocs.map((doc) => doc.publicId));
		console.log(
			`Found ${existingPublicIds.size} existing entries in imageSelectionCounts`
		);

		// Find entries that don't have a corresponding document
		const missingEntries = [];
		for (const entry of imageMetadata) {
			// publicId is the filename without extension
			const publicId = entry.filename.replace(/\.[^.]+$/, '');
			if (!existingPublicIds.has(publicId)) {
				missingEntries.push({ ...entry, publicId });
			}
		}

		console.log(
			`Found ${missingEntries.length} entries without corresponding imageSelectionCounts document`
		);

		if (missingEntries.length === 0) {
			console.log('No missing entries to add.');
			return;
		}

		// Create documents for missing entries with random count between 2 and 8
		const documentsToInsert = missingEntries.map((entry) => {
			const count = Math.floor(Math.random() * 7) + 2; // Random int between 2 and 8
			return {
				publicId: entry.publicId,
				count,
				randomCount: count, // Flag to indicate this was randomly generated
				lastSelectionDate: new Date(),
			};
		});

		// Insert all documents
		const result = await collection.insertMany(documentsToInsert);
		console.log(
			`Inserted ${result.insertedCount} new documents with random counts`
		);

		// Log a sample of what was inserted
		console.log('\nSample of inserted documents:');
		documentsToInsert.slice(0, 5).forEach((doc) => {
			console.log(
				`  ${doc.publicId}: count=${doc.count}, randomCount=${doc.randomCount}`
			);
		});
		if (documentsToInsert.length > 5) {
			console.log(`  ... and ${documentsToInsert.length - 5} more`);
		}
	} finally {
		await client.close();
		console.log('\nDisconnected from MongoDB');
	}
}

setRandomVotes().catch(console.error);
