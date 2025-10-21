/**
 * ParkEase Backend - Encryption Utilities
 * Data encryption and hashing functions
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

/**
 * Hash password using bcrypt
 */
exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
exports.comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate random hash
 */
exports.generateHash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate HMAC signature
 */
exports.generateHMAC = (data, secret) => {
    return crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('hex');
};

/**
 * Verify Razorpay signature
 */
exports.verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
    const generatedSignature = exports.generateHMAC(
        `${orderId}|${paymentId}`,
        secret
    );
    return generatedSignature === signature;
};

/**
 * Encrypt data
 */
exports.encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt data
 */
exports.decrypt = (text, key) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};