import { NextResponse } from 'next/server';

export function handleError(error: unknown, customMessage?: string): NextResponse {
    if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]:', error);
    }

    return NextResponse.json({ error: customMessage || "Internal Server Error" }, { status: 500 });
}

export function createErrorResponse(message: string, status: number): NextResponse {
    return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: unknown, status: number = 200, cacheControl?: string): NextResponse {
    const headers: HeadersInit = {};
    if (cacheControl) {
        headers['Cache-Control'] = cacheControl;
    }

    return NextResponse.json(data, { status, headers });
}