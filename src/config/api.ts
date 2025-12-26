const ACTIVE = import.meta.env.VITE_ACTIVE_BACKEND;

export const API_BASE =
    ACTIVE === "django"
        ? import.meta.env.VITE_DJANGO_API_BASE
        : import.meta.env.VITE_LARAVEL_API_BASE;