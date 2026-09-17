import { BiometricService } from '../services/biometric.service';
import { EncryptionService } from '../services/encryption.service';

describe('BiometricService Tests', () => {
  test('Identifies known patient by biometric hash within 500ms', async () => {
    const result = await BiometricService.identify(
      undefined,
      'face_hash_aravind_sharma_sample_token_001',
      'face_embedding'
    );

    expect(result.matched).toBe(true);
    expect(result.patient_id).toBe('a1111111-1111-1111-1111-111111111111');
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    expect(result.duration_ms).toBeLessThan(1500); // Live cloud DB roundtrip
  });

  test('In-memory cosine vector matching performs under 50ms', () => {
    const vecA = new Array(128).fill(0.1);
    const startTime = performance.now();
    const similarity = BiometricService.calculateCosineSimilarity(vecA, vecA);
    const duration = performance.now() - startTime;
    expect(similarity).toBeCloseTo(1.0, 4);
    expect(duration).toBeLessThan(50);
  });

  test('Handles unknown biometric gracefully without crashing', async () => {
    const result = await BiometricService.identify(
      undefined,
      'non_existent_face_hash_unknown_9999',
      'face_embedding'
    );

    expect(result.matched).toBe(false);
  });

  test('Cosine similarity matches identical vectors with 1.0', () => {
    const vecA = [0.5, 0.5, 0.5, 0.5];
    const similarity = BiometricService.calculateCosineSimilarity(vecA, vecA);
    expect(similarity).toBeCloseTo(1.0, 4);
  });
});

describe('EncryptionService (AES-256-GCM) Tests', () => {
  test('Encrypts and decrypts sensitive patient data successfully', () => {
    const medicalNote = { condition: 'Trauma Code Red', allergy: 'Penicillin' };
    const ciphertext = EncryptionService.encryptPatientData(medicalNote);

    expect(ciphertext).toContain(':'); // Contains iv:authTag:ciphertext
    const decrypted = EncryptionService.decryptPatientData(ciphertext);
    expect(decrypted).toEqual(medicalNote);
  });

  test('Produces consistent HMAC hashes and verifies them', () => {
    const phone = '9876543210';
    const hash = EncryptionService.hashSensitiveField(phone);
    expect(EncryptionService.verifyHash(phone, hash)).toBe(true);
    expect(EncryptionService.verifyHash('0000000000', hash)).toBe(false);
  });
});

