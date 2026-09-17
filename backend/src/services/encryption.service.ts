import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag

// Default secret key (32 bytes = 256 bits)
const MASTER_KEY = process.env.ENCRYPTION_MASTER_KEY 
  ? Buffer.from(process.env.ENCRYPTION_MASTER_KEY, 'hex') 
  : crypto.createHash('sha256').update('medaccess-emergency-default-key-32b').digest();

export class EncryptionService {
  /**
   * Encrypts sensitive patient payload using AES-256-GCM (Authenticated Encryption)
   * Never leaks plaintext even under chosen-ciphertext attack.
   */
  public static encryptPatientData(data: any, key: Buffer = MASTER_KEY): string {
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypts authenticated ciphertext using AES-256-GCM
   */
  public static decryptPatientData(encryptedPayload: string, key: Buffer = MASTER_KEY): any {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted payload format. Expected iv:authTag:ciphertext');
    }

    const [ivHex, authTagHex, cipherHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  /**
   * One-way SHA-256 hash for sensitive identifiers (e.g. phone numbers, national IDs)
   */
  public static hashSensitiveField(value: string, salt: string = 'medaccess-salt-2026'): string {
    return crypto.createHmac('sha256', salt).update(value.trim()).digest('hex');
  }

  /**
   * Verifies an input against an existing HMAC hash in constant time
   */
  public static verifyHash(value: string, storedHash: string, salt: string = 'medaccess-salt-2026'): boolean {
    const computed = this.hashSensitiveField(value, salt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(storedHash));
  }
}

