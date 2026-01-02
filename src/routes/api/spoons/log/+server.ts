import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This will be replaced with actual database logic
// For now, just a mock response

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate data
		if (
			typeof data.physical !== 'number' ||
			typeof data.focus !== 'number' ||
			typeof data.initiation !== 'number' ||
			typeof data.sensory !== 'number' ||
			typeof data.masking !== 'number'
		) {
			return json({ error: 'Invalid spoon values' }, { status: 400 });
		}

		// TODO: Insert into database
		// const result = await db.insert(spoonLogs).values(data);

		console.log('[Spoons] Logged entry:', data);

		// Mock response
		return json({
			success: true,
			timestamp: new Date().toISOString(),
			xpEarned: 10
		});
	} catch (error) {
		console.error('[Spoons] Error logging entry:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
