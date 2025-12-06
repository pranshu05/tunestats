export const VALID_ENTITY_TYPES = ['user', 'track', 'album', 'artist'] as const;
export type EntityType = typeof VALID_ENTITY_TYPES[number];

export const VALID_TIME_RANGES = ['week', 'month', 'year'] as const;
export type TimeRange = typeof VALID_TIME_RANGES[number];

export const TIME_RANGE_DAYS: Record<TimeRange, number> = {
    week: 7,
    month: 30,
    year: 365,
};

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export const COMMENT_MIN_LENGTH = 1;
export const COMMENT_MAX_LENGTH = 2000;

export function isValidEntityType(type: unknown): type is EntityType {
    return typeof type === 'string' && VALID_ENTITY_TYPES.includes(type as EntityType);
}

export function isValidTimeRange(range: unknown): range is TimeRange {
    return typeof range === 'string' && VALID_TIME_RANGES.includes(range as TimeRange);
}

export function isValidRating(rating: unknown): rating is number {
    return typeof rating === 'number' &&
        Number.isInteger(rating) &&
        rating >= RATING_MIN &&
        rating <= RATING_MAX;
}

export function isValidId(id: unknown): id is string {
    return typeof id === 'string' && id.trim().length > 0;
}

export function isValidCommentText(text: unknown): text is string {
    if (typeof text !== 'string') return false;
    const trimmed = text.trim();
    return trimmed.length >= COMMENT_MIN_LENGTH && trimmed.length <= COMMENT_MAX_LENGTH;
}

export function sanitizeString(input: string): string {
    return input.trim();
}

export function validatePagination(limit?: unknown, offset?: unknown): { limit: number; offset: number; } {
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) :
        typeof limit === 'number' ? limit : 50;
    const parsedOffset = typeof offset === 'string' ? parseInt(offset, 10) :
        typeof offset === 'number' ? offset : 0;

    return {
        limit: Math.min(Math.max(1, parsedLimit), 100),
        offset: Math.max(0, parsedOffset),
    };
}