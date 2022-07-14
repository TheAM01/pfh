import crypto from "crypto";

function createHash (str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

function validateHash(raw, hash) {
    return (createHash(raw)) === hash;
};

export default {
    createHash,
    validateHash
}