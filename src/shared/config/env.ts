export const readEnv = () => {
    return {
        activeBackendDefault: import.meta.env.VITE_ACTIVE_BACKEND,
        laravelApiBase: import.meta.env.VITE_LARAVEL_API_BASE,
        djangoApiBase: import.meta.env.VITE_DJANGO_API_BASE,
    };
}