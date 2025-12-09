/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {{ valid: boolean, message: string }}
 */
const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { valid: false, message: 'Şifre en az 6 karakter olmalıdır' };
    }
    return { valid: true, message: '' };
};

/**
 * Sanitize string input
 * @param {string} str 
 * @returns {string}
 */
const sanitizeString = (str) => {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate required fields
 * @param {Object} body 
 * @param {Array<string>} requiredFields 
 * @returns {{ valid: boolean, missing: Array<string> }}
 */
const validateRequired = (body, requiredFields) => {
    const missing = [];

    for (const field of requiredFields) {
        if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
            missing.push(field);
        }
    }

    return {
        valid: missing.length === 0,
        missing
    };
};

/**
 * Validate integer
 * @param {*} value 
 * @returns {boolean}
 */
const isValidInteger = (value) => {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
};

module.exports = {
    isValidEmail,
    validatePassword,
    sanitizeString,
    validateRequired,
    isValidInteger
};
