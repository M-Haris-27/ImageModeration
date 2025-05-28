// utils/constants.js

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000',
    TIMEOUT: 30000, // 30 seconds
};

// File Upload Constants
export const FILE_UPLOAD = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Moderation Categories
export const MODERATION_CATEGORIES = {
    VIOLENCE: {
        key: 'violence',
        label: 'Violence',
        description: 'Content depicting graphic violence, blood, or physical harm',
        icon: '⚔️',
    },
    NUDITY: {
        key: 'nudity',
        label: 'Nudity',
        description: 'Content containing nudity or sexually explicit material',
        icon: '🔞',
    },
    HATE_SYMBOLS: {
        key: 'hate_symbols',
        label: 'Hate Symbols',
        description: 'Content containing hate symbols, racist imagery, or discriminatory content',
        icon: '🚫',
    },
    SELF_HARM: {
        key: 'self_harm',
        label: 'Self Harm',
        description: 'Content depicting self-harm, suicide, or related imagery',
        icon: '⚠️',
    },
    EXTREMIST_PROPAGANDA: {
        key: 'extremist_propaganda',
        label: 'Extremist Propaganda',
        description: 'Content promoting extremist ideologies or terrorist organizations',
        icon: '🎯',
    },
    DRUGS: {
        key: 'drugs',
        label: 'Drugs',
        description: 'Content depicting illegal drugs or drug paraphernalia',
        icon: '💊',
    },
    WEAPONS: {
        key: 'weapons',
        label: 'Weapons',
        description: 'Content depicting weapons or dangerous objects',
        icon: '🔫',
    },
};

// Confidence Thresholds
export const CONFIDENCE_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8,
};

// Safety Levels
export const SAFETY_LEVELS = {
    SAFE: {
        label: 'Safe',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
    },
    WARNING: {
        label: 'Warning',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
    },
    UNSAFE: {
        label: 'Unsafe',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
    },
};

// UI Messages
export const MESSAGES = {
    AUTH: {
        INVALID_TOKEN: 'Invalid or expired token. Please check and try again.',
        TOKEN_REQUIRED: 'Please enter a valid authentication token.',
        LOGIN_SUCCESS: 'Successfully authenticated!',
        LOGOUT_SUCCESS: 'Successfully logged out.',
        ADMIN_REQUIRED: 'Admin privileges required for this action.',
    },
    UPLOAD: {
        FILE_TOO_LARGE: `File too large. Maximum size is ${FILE_UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`,
        INVALID_TYPE: `Invalid file type. Supported formats: ${FILE_UPLOAD.ALLOWED_TYPES.join(', ')}`,
        UPLOAD_SUCCESS: 'Image uploaded and analyzed successfully!',
        UPLOAD_ERROR: 'Failed to upload and analyze image.',
        NO_FILE_SELECTED: 'Please select an image file to analyze.',
    },
    TOKENS: {
        CREATE_SUCCESS: 'Token created successfully!',
        DELETE_SUCCESS: 'Token deleted successfully!',
        DELETE_CONFIRM: 'Are you sure you want to delete this token?',
        COPY_SUCCESS: 'Token copied to clipboard!',
        CANNOT_DELETE_OWN: 'Cannot delete your own admin token.',
    },
    GENERAL: {
        LOADING: 'Loading...',
        PROCESSING: 'Processing...',
        ERROR_OCCURRED: 'An error occurred. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your connection.',
    },
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER_PREFERENCES: 'userPreferences',
    LAST_UPLOAD: 'lastUpload',
};

// API Endpoints
export const ENDPOINTS = {
    AUTH: {
        TOKENS: '/auth/tokens',
        USAGE_STATS: '/auth/usage-stats',
    },
    MODERATION: {
        ANALYZE: '/moderate/analyze',
        CATEGORIES: '/moderate/categories',
    },
    HEALTH: '/health',
};

// Time Formats
export const TIME_FORMATS = {
    FULL_DATE: 'YYYY-MM-DD HH:mm:ss',
    SHORT_DATE: 'MM/DD/YYYY',
    TIME_ONLY: 'HH:mm:ss',
    RELATIVE: 'relative', // for "2 hours ago" format
};

// Application States
export const APP_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    PROCESSING: 'processing',
};

// Default Values
export const DEFAULTS = {
    PAGINATION_LIMIT: 10,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
};