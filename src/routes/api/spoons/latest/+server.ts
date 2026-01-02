import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// TODO: Get latest entry from database
		// const latest = await db.select().from(spoonLogs).orderBy(desc(spoonLogs.timestamp)).limit(1);

		console.log('[Spoons] Fetching latest entry');

		// Mock response
		return json({
			timestamp: new Date().toISOString(),
			physical: 3,
			focus: 2,
			initiation: 2,
			sensory: 4,
			masking: 1,
			baseline: 'normal',
			note: null
		});
	} catch (error) {
		console.error('[Spoons] Error fetching latest entry:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
