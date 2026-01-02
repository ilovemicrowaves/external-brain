// Core app types
export interface App {
	id: string;
	name: string;
	icon: string;
	route: string;
	color: string;
	category?: 'energy' | 'health' | 'habits' | 'data' | 'other';
	description?: string;

	// Optional widget for dashboard
	widget?: {
		component: () => Promise<any>;
		size?: 'small' | 'medium' | 'large';
	};

	// Optional Grafana integration
	grafana?: {
		dashboardId: string;
	};

	// Optional Home Assistant integration
	homeAssistant?: {
		entities: string[];
	};
}

// Feed card types
export type FeedCardType = 'achievement' | 'insight' | 'throwback' | 'milestone' | 'challenge' | 'celebration';

export interface FeedCard {
	id: string;
	type: FeedCardType;
	title: string;
	content: string;
	icon?: string;
	timestamp: Date;
	data?: Record<string, any>;
	action?: {
		label: string;
		href: string;
	};
}

// Gamification types
export interface UserProgress {
	totalXP: number;
	level: number;
	currentLevelXP: number;
	nextLevelXP: number;
	streaks: Streak[];
	achievements: Achievement[];
	dailyQuests: Quest[];
}

export interface Streak {
	id: string;
	name: string;
	icon: string;
	currentDays: number;
	bestDays: number;
	lastUpdated: Date;
}

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlockedAt?: Date;
	progress?: number;
	maxProgress?: number;
}

export interface Quest {
	id: string;
	title: string;
	xpReward: number;
	completed: boolean;
	action?: string;
}

// Spoons types
export type SpoonType = 'physical' | 'focus' | 'initiation' | 'sensory' | 'masking';

export type SpoonLevel = 0 | 1 | 2 | 3 | 4;

export type BaselineType = 'normal' | 'good' | 'rough' | 'terrible';

export interface SpoonLog {
	id: number;
	timestamp: Date;
	physical: SpoonLevel;
	focus: SpoonLevel;
	initiation: SpoonLevel;
	sensory: SpoonLevel;
	masking: SpoonLevel;
	baseline: BaselineType;
	note?: string;
}

export interface SpoonLevelInfo {
	emoji: string;
	label: string;
	color: string;
}
