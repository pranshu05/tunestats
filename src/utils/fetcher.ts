interface FetchError extends Error {
    info?: unknown;
    status?: number;
}

export const fetcher = async (url: string) => {
    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const error = new Error('An error occurred while fetching the data.') as FetchError;
            
            // Try to get error details from response
            try {
                const errorData = await res.json();
                error.info = errorData;
            } catch {
                error.info = await res.text();
            }
            
            error.status = res.status;
            throw error;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        // Network errors or JSON parsing errors
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
};

// Fetcher with retry logic for critical requests
export const fetcherWithRetry = async (url: string, maxRetries = 3) => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetcher(url);
        } catch (error) {
            lastError = error as Error;
            
            // Don't retry on 4xx errors (client errors)
            if (error instanceof Error && 'status' in error) {
                const fetchError = error as FetchError;
                if (fetchError.status && fetchError.status >= 400 && fetchError.status < 500) {
                    throw error;
                }
            }
            
            // Wait before retrying (exponential backoff)
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }
    
    throw lastError;
};