import CryptoJS from 'crypto-js';

export class EncryptionService {
  private readonly key: string;
  private readonly iv: string;

  constructor() {
    // In production, these should be loaded from secure environment variables
    this.key = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-encryption-key-min-32-chars';
    this.iv = import.meta.env.VITE_ENCRYPTION_IV || 'your-secure-iv-16-chars';
  }

  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.key, {
        iv: CryptoJS.enc.Utf8.parse(this.iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
        iv: CryptoJS.enc.Utf8.parse(this.iv),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      });
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generate a secure checksum for data verification
  generateChecksum(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.SHA256(jsonString).toString();
  }

  // Verify data integrity using checksum
  verifyChecksum(data: any, checksum: string): boolean {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === checksum;
  }
}