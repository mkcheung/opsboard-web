export function extractDataByPlatform<T>(payload: any): T[] {
    if (!payload) return [];

    //For Django
    if (Array.isArray(payload.results)) return payload.results as T[];

    //For Laravel
    if (Array.isArray(payload.data)) return payload.data as T[];

    if (Array.isArray(payload?.data?.data)) return payload.data.data as T[];

    if (Array.isArray(payload?.data?.data?.data)) return payload.data.data.data as T[];

    if (Array.isArray(payload)) return payload as T[];

    return [];
}