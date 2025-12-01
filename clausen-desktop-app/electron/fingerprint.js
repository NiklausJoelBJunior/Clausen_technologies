/**
 * Fingerprint Scanner Module
 * Handles communication with fingerprint scanner devices
 */

const { SerialPort } = require('serialport');
const HID = require('node-hid');

class FingerprintScanner {
  constructor() {
    this.device = null;
    this.isScanning = false;
    this.scanTimeout = 10000; // 10 seconds timeout
  }

  /**
   * List all available fingerprint scanner devices
   */
  async listDevices() {
    try {
      // List HID devices (USB fingerprint scanners)
      const hidDevices = HID.devices();
      
      // Common fingerprint scanner vendor IDs
      const fingerprintVendors = [
        0x1C7A, // DigitalPersona
        0x2808, // ZKTeco
        0x27C6, // Goodix
        0x06CB, // Synaptics
        0x147E, // Upek/Validity
      ];

      const scanners = hidDevices.filter(device => 
        fingerprintVendors.includes(device.vendorId) ||
        (device.product && device.product.toLowerCase().includes('fingerprint'))
      );

      return scanners.map(device => ({
        vendorId: device.vendorId,
        productId: device.productId,
        manufacturer: device.manufacturer || 'Unknown',
        product: device.product || 'Fingerprint Scanner',
        path: device.path
      }));
    } catch (error) {
      console.error('Error listing devices:', error);
      return [];
    }
  }

  /**
   * Connect to fingerprint scanner
   */
  async connect(devicePath) {
    try {
      if (!devicePath) {
        const devices = await this.listDevices();
        if (devices.length === 0) {
          throw new Error('No fingerprint scanner found');
        }
        devicePath = devices[0].path;
      }

      this.device = new HID.HID(devicePath);
      console.log('✓ Connected to fingerprint scanner');
      return true;
    } catch (error) {
      console.error('Failed to connect to fingerprint scanner:', error);
      throw new Error('Could not connect to fingerprint scanner. Make sure the device is plugged in.');
    }
  }

  /**
   * Disconnect from fingerprint scanner
   */
  disconnect() {
    if (this.device) {
      try {
        this.device.close();
        this.device = null;
        console.log('✓ Disconnected from fingerprint scanner');
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  }

  /**
   * Start scanning for fingerprint
   * Returns a promise that resolves with fingerprint data
   */
  async scan() {
    return new Promise((resolve, reject) => {
      if (!this.device) {
        reject(new Error('Scanner not connected. Please connect a fingerprint scanner first.'));
        return;
      }

      if (this.isScanning) {
        reject(new Error('Scan already in progress'));
        return;
      }

      this.isScanning = true;
      const startTime = Date.now();
      let fingerprintData = [];

      // Set timeout
      const timeout = setTimeout(() => {
        this.isScanning = false;
        this.device.removeAllListeners('data');
        reject(new Error('Scan timeout - no fingerprint detected'));
      }, this.scanTimeout);

      // Listen for data from scanner
      this.device.on('data', (data) => {
        fingerprintData.push(...data);

        // Check if we have enough data (this varies by scanner)
        // Most scanners send data in chunks, we need to detect when complete
        if (fingerprintData.length >= 512) { // Minimum template size
          clearTimeout(timeout);
          this.isScanning = false;
          this.device.removeAllListeners('data');

          // Convert to base64 for storage
          const fingerprintTemplate = Buffer.from(fingerprintData).toString('base64');
          
          resolve({
            template: fingerprintTemplate,
            quality: this.calculateQuality(fingerprintData),
            timestamp: new Date().toISOString()
          });
        }
      });

      this.device.on('error', (error) => {
        clearTimeout(timeout);
        this.isScanning = false;
        this.device.removeAllListeners('data');
        reject(error);
      });
    });
  }

  /**
   * Verify fingerprint against stored template
   */
  async verify(scannedTemplate, storedTemplate) {
    try {
      if (!scannedTemplate || !storedTemplate) {
        return { match: false, confidence: 0 };
      }

      // Convert base64 templates back to buffers
      const scanned = Buffer.from(scannedTemplate, 'base64');
      const stored = Buffer.from(storedTemplate, 'base64');

      // Simple comparison (in production, use proper biometric matching algorithm)
      // This is a placeholder - real fingerprint matching requires specialized algorithms
      const similarity = this.compareFingerprintTemplates(scanned, stored);
      const threshold = 0.85; // 85% similarity threshold

      return {
        match: similarity >= threshold,
        confidence: Math.round(similarity * 100),
        threshold: Math.round(threshold * 100)
      };
    } catch (error) {
      console.error('Verification error:', error);
      return { match: false, confidence: 0, error: error.message };
    }
  }

  /**
   * Calculate fingerprint quality score
   */
  calculateQuality(data) {
    // Simple quality check based on data variance
    // In production, use proper quality metrics
    const variance = this.calculateVariance(data);
    const quality = Math.min(100, Math.max(0, (variance / 10) * 100));
    return Math.round(quality);
  }

  /**
   * Calculate variance of data
   */
  calculateVariance(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Compare two fingerprint templates
   * Returns similarity score between 0 and 1
   */
  compareFingerprintTemplates(template1, template2) {
    // Simple byte-by-byte comparison
    // In production, use proper minutiae-based matching algorithm
    const minLength = Math.min(template1.length, template2.length);
    let matchingBytes = 0;

    for (let i = 0; i < minLength; i++) {
      if (template1[i] === template2[i]) {
        matchingBytes++;
      }
    }

    return matchingBytes / minLength;
  }

  /**
   * Check if scanner is connected and ready
   */
  isReady() {
    return this.device !== null && !this.isScanning;
  }

  /**
   * Get scanner status
   */
  getStatus() {
    return {
      connected: this.device !== null,
      scanning: this.isScanning,
      ready: this.isReady()
    };
  }
}

// Export singleton instance
module.exports = new FingerprintScanner();
