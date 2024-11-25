import { v4 as uuidv4 } from 'uuid';
import { EncryptionService } from './encryption';

const encryptionService = new EncryptionService();

export interface NFCCardConfig {
  uid: string;
  merchantId: string;
  locationId?: string;
  campaignId?: string;
  gmbUrl?: string;
  shortenedUrl?: string;
  metadata: {
    merchantName: string;
    locationName?: string;
    campaignName?: string;
    createdAt: string;
    lastModified: string;
  };
  security: {
    encryptedData: string;
    checksum: string;
    version: string;
  };
}

interface NFCSecureData {
  uid: string;
  merchantId: string;
  locationId?: string;
  timestamp: number;
  nonce: string;
}

export function generateNFCConfig(
  merchantId: string,
  locationId?: string,
  campaignId?: string,
  gmbUrl?: string
): NFCCardConfig {
  const uid = uuidv4().replace(/-/g, '').substring(0, 16); // 64-bit UID
  
  // Create secure data payload
  const secureData: NFCSecureData = {
    uid,
    merchantId,
    locationId,
    timestamp: Date.now(),
    nonce: uuidv4(), // Add randomness to prevent replay attacks
  };

  // Encrypt sensitive data
  const encryptedData = encryptionService.encrypt(secureData);
  const checksum = encryptionService.generateChecksum(secureData);

  return {
    uid,
    merchantId,
    locationId,
    campaignId,
    gmbUrl,
    metadata: {
      merchantName: 'Default Merchant', // Should be fetched from merchant profile
      locationName: locationId ? `Location ${locationId}` : undefined,
      campaignName: campaignId ? `Campaign ${campaignId}` : undefined,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
    security: {
      encryptedData,
      checksum,
      version: '1.0', // For future encryption scheme updates
    },
  };
}

export function verifyNFCCard(config: NFCCardConfig): boolean {
  try {
    // Decrypt the secure data
    const decryptedData = encryptionService.decrypt(config.security.encryptedData) as NFCSecureData;

    // Verify checksum
    if (!encryptionService.verifyChecksum(decryptedData, config.security.checksum)) {
      console.error('NFC card checksum verification failed');
      return false;
    }

    // Verify UID matches
    if (decryptedData.uid !== config.uid) {
      console.error('NFC card UID mismatch');
      return false;
    }

    // Verify merchant ID matches
    if (decryptedData.merchantId !== config.merchantId) {
      console.error('NFC card merchant ID mismatch');
      return false;
    }

    // Check if the card data is not too old (e.g., 1 year)
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (Date.now() - decryptedData.timestamp > maxAge) {
      console.error('NFC card data has expired');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying NFC card:', error);
    return false;
  }
}