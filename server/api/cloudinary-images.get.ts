import imageMetadata from '../assets/image-metadata.json';

// Cache the metadata array for fast access
const images = imageMetadata as Array<{
	filename: string;
	query: string;
	category: string;
	sourceUrl: string;
}>;

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const count = Math.min(Math.max(Number(query.count) || 4, 1), 40); // Default 4, min 1, max 40

	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

	try {
		// Select random images from local metadata (instant, no API calls)
		const selectedImages: typeof images = [];
		const usedIndices = new Set<number>();

		while (selectedImages.length < count && usedIndices.size < images.length) {
			const randomIndex = Math.floor(Math.random() * images.length);
			if (!usedIndices.has(randomIndex)) {
				usedIndices.add(randomIndex);
				selectedImages.push(images[randomIndex]);
			}
		}

		// Build Cloudinary URLs for the selected images
		const result = selectedImages.map((img) => {
			const publicId = img.filename.replace(/\.[^.]+$/, ''); // Remove file extension
			return {
				url: `https://res.cloudinary.com/${cloudName}/image/upload/images-queries/${publicId}.jpg`,
				publicId,
				query: img.query,
				category: img.category,
			};
		});

		return { images: result };
	} catch (error: any) {
		console.error('Error selecting random images:', error);
		throw createError({
			statusCode: 500,
			message: error.message || 'Failed to select random images',
		});
	}
});
