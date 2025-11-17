import { getDb } from '../utils/mongo';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!body || !body.white || !body.black) {
		throw createError({
			statusCode: 400,
			statusMessage: 'white and black required',
		});
	}
	const db = await getDb();
	const res = await db
		.collection('games')
		.insertOne({ white: body.white, black: body.black, createdAt: new Date() });
	const inserted = await db
		.collection('games')
		.findOne({ _id: res.insertedId });
	return inserted;
});
