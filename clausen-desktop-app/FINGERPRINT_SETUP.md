# Fingerprint Scanner Setup Guide

This guide will help you set up fingerprint scanning functionality for student identification in the Clausen School Management System.

## Overview

The system supports USB fingerprint scanners for biometric student identification. Students can have their fingerprints enrolled in the system for quick verification during attendance, login, or other verification processes.

## Supported Fingerprint Scanners

The application supports various USB fingerprint scanner devices from manufacturers including:

- **DigitalPersona** (U.are.U series)
- **ZKTeco** (ZK series)
- **Goodix** fingerprint sensors
- **Synaptics** fingerprint readers
- **Generic USB fingerprint scanners**

## Hardware Requirements

1. **USB Fingerprint Scanner Device**
   - USB 2.0 or higher compatible
   - Optical or capacitive sensor
   - Driver support for macOS/Windows/Linux

2. **USB Port**
   - Available USB port on your computer
   - USB hub supported (powered recommended)

## Installation Steps

### 1. Install Scanner Hardware

1. **Connect the fingerprint scanner** to your computer's USB port
2. Wait for the operating system to detect the device
3. Install manufacturer's drivers if required (varies by device)

### 2. Verify Scanner Detection

The application will automatically detect supported fingerprint scanners. To verify:

1. Open the Clausen application
2. Navigate to **Students Management**
3. Click **"+ Enroll"** on any student row
4. The system will attempt to connect to available scanners

### 3. Database Setup (Already Done)

The database has been updated with fingerprint support:

```sql
-- New columns in students table:
fingerprint_data TEXT         -- Stores encrypted fingerprint template
fingerprint_enrolled BOOLEAN  -- Indicates if fingerprint is enrolled
```

If you've already created the database before this update, run this SQL to add fingerprint columns:

```sql
USE clausen_school;

ALTER TABLE students 
ADD COLUMN fingerprint_data TEXT AFTER photo_url,
ADD COLUMN fingerprint_enrolled BOOLEAN DEFAULT FALSE AFTER fingerprint_data;
```

## Using Fingerprint Enrollment

### Enrolling a Student's Fingerprint

1. **Navigate to Students page**
2. **Find the student** you want to enroll
3. **Click "+ Enroll"** in the Fingerprint column
4. **Place finger** on the scanner when prompted
5. **Wait for confirmation** - the system will show quality score
6. **Success** - fingerprint is now enrolled

### Best Practices for Enrollment

- **Clean fingers**: Ensure the student's finger is clean and dry
- **Proper placement**: Center the finger on the scanner
- **Firm pressure**: Apply consistent, moderate pressure
- **Multiple attempts**: The system may require 2-3 scans for quality
- **Quality threshold**: Aim for 85% or higher quality score

### Removing a Fingerprint

1. Navigate to the student's row
2. Click **"Remove"** next to the enrolled fingerprint
3. Confirm the removal
4. The fingerprint data will be deleted from the database

## Features

### Current Implementation

- ✅ **Fingerprint Enrollment**: Scan and store student fingerprints
- ✅ **Database Storage**: Encrypted storage of fingerprint templates
- ✅ **Quality Detection**: Automatic quality scoring (0-100%)
- ✅ **Scanner Status**: Real-time scanner connection status
- ✅ **Multi-Scanner Support**: Automatic detection of compatible devices
- ✅ **Remove Fingerprint**: Delete enrolled fingerprints

### Planned Features

- ⏳ **Fingerprint Verification**: Quick student lookup by fingerprint
- ⏳ **Attendance by Fingerprint**: Mark attendance using fingerprint scan
- ⏳ **Login with Fingerprint**: Teacher/admin login using biometrics
- ⏳ **Multiple Fingerprints**: Store multiple fingers per student
- ⏳ **Matching Algorithm**: Advanced minutiae-based matching

## Technical Details

### How It Works

1. **Scanner Connection**: The app connects to USB HID devices
2. **Data Capture**: Raw fingerprint data is captured from sensor
3. **Template Creation**: Data is converted to a fingerprint template
4. **Encryption**: Template is encoded to base64 for storage
5. **Database Storage**: Encrypted template saved in MySQL
6. **Verification**: Stored template can be compared with new scans

### Security

- **No Raw Images**: Only fingerprint templates are stored, not images
- **Base64 Encoding**: Templates are encoded for safe storage
- **Database Security**: MySQL password protection
- **One-Way Matching**: Templates cannot be reverse-engineered to fingerprints

### Libraries Used

- **serialport**: USB serial communication
- **node-hid**: USB HID device access
- **mysql2**: Database operations

## Troubleshooting

### Scanner Not Detected

**Problem**: "No fingerprint scanner found" error

**Solutions**:
1. Check USB connection - try different port
2. Install manufacturer's drivers
3. Check device in System Preferences (Mac) or Device Manager (Windows)
4. Restart the application
5. Try a different USB fingerprint scanner

### Poor Quality Scans

**Problem**: Quality score below 85%

**Solutions**:
1. Clean the scanner surface
2. Ensure finger is clean and dry
3. Apply more consistent pressure
4. Try a different finger
5. Check scanner hardware for damage

### Scan Timeout

**Problem**: "Scan timeout - no fingerprint detected"

**Solutions**:
1. Place finger firmly on scanner
2. Hold still for 3-5 seconds
3. Try rescanning immediately
4. Check if scanner LED is active
5. Restart scanner connection

### Database Connection Error

**Problem**: "Database not connected"

**Solutions**:
1. Ensure XAMPP MySQL is running
2. Check database exists: `clausen_school`
3. Verify database columns exist (run ALTER TABLE if needed)
4. Check MySQL credentials in `electron/database.js`

## Scanner Recommendations

### Budget-Friendly Options

1. **Generic USB Fingerprint Scanner** ($15-30)
   - Basic functionality
   - USB plug-and-play
   - Suitable for small schools

2. **ZKTeco ZK4500** ($40-60)
   - Good reliability
   - Fast scanning
   - Wide compatibility

### Professional Options

1. **DigitalPersona U.are.U 4500** ($80-120)
   - High accuracy
   - FBI-certified sensor
   - Durable design
   - Excellent SDK support

2. **ZKTeco SLK20R** ($60-90)
   - RFID + Fingerprint combo
   - Fast recognition
   - Large capacity

## API Reference

### Fingerprint Functions (Available in Renderer)

```javascript
// List available fingerprint devices
const devices = await window.electronAPI.fingerprint.listDevices()

// Connect to scanner
const result = await window.electronAPI.fingerprint.connect(devicePath)

// Scan fingerprint
const scan = await window.electronAPI.fingerprint.scan()

// Verify fingerprint
const match = await window.electronAPI.fingerprint.verify({
  scannedTemplate: 'base64...',
  storedTemplate: 'base64...'
})

// Get scanner status
const status = await window.electronAPI.fingerprint.getStatus()

// Disconnect scanner
await window.electronAPI.fingerprint.disconnect()
```

### Database Functions

```javascript
// Update student fingerprint
await window.electronAPI.database.updateFingerprint(studentId, fingerprintData)

// Find student by fingerprint
await window.electronAPI.database.getStudentByFingerprint(fingerprintData)

// Remove student fingerprint
await window.electronAPI.database.removeFingerprint(studentId)
```

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check device manufacturer's documentation
4. Test with a different fingerprint scanner

## Next Steps

After setting up fingerprint scanning:
1. Enroll key students first (class monitors, etc.)
2. Test verification with enrolled fingerprints
3. Train staff on proper enrollment procedures
4. Set up attendance marking workflow
5. Monitor quality scores and adjust procedures

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**System**: Clausen School Management System
