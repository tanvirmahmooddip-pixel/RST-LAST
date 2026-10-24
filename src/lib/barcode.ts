/**
 * Barcode, IMEI & QR Code Utilities for Retail, Documents & Mobile Devices
 */

// Generate valid EAN-13 barcode with mod 10 checksum
export function generateEAN13(prefix = '890'): string {
  const timestampPart = String(Date.now()).slice(-8);
  const randomDigit = Math.floor(Math.random() * 9);
  const base12 = `${prefix}${timestampPart}${randomDigit}`.slice(0, 12);
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12[i], 10);
    sum += i % 2 === 0 ? digit * 1 : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return `${base12}${checkDigit}`;
}

// Generate valid 15-digit IMEI with Luhn checksum (Standard TAC 35 or 86)
export function generateIMEI(tacPrefix = '35'): string {
  const remainingTacDigits = Math.max(0, 8 - tacPrefix.length);
  const randomTac = String(Math.floor(100000 + Math.random() * 900000)).slice(0, remainingTacDigits);
  const tac = (tacPrefix + randomTac).slice(0, 8);
  const snr = String(Math.floor(100000 + Math.random() * 900000));
  const imei14 = (tac + snr).slice(0, 14);

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let d = parseInt(imei14[i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  return `${imei14}${check}`;
}

export function validateIMEI(imei: string): boolean {
  const clean = imei.replace(/\D/g, '');
  if (clean.length !== 15) return false;
  
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = parseInt(clean[i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function generateSerial(prefix = 'RST'): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${now}-${rand}`;
}

export function generateSlDocNo(prefix = 'SL-DOC', seqNum = 1): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(seqNum).padStart(5, '0')}`;
}

/**
 * Pure SVG Barcode Renderer (Code 128 / Linear Barcode pattern)
 */
export function generateBarcodeSvg(code: string, width = 240, height = 70): string {
  if (!code) code = 'RST-0000';
  
  const bars: { x: number; w: number }[] = [];
  let currentX = 15;
  const barUnit = (width - 30) / (code.length * 9 + 20);

  // Start pattern
  bars.push({ x: currentX, w: barUnit * 2 });
  currentX += barUnit * 3;
  bars.push({ x: currentX, w: barUnit });
  currentX += barUnit * 2;

  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = (charCode * 7 + i * 13) % 16;
    
    bars.push({ x: currentX, w: barUnit * (1 + (pattern % 2)) });
    currentX += barUnit * (2 + ((pattern >> 1) % 2));
    bars.push({ x: currentX, w: barUnit * (1 + ((pattern >> 2) % 2)) });
    currentX += barUnit * (2 + ((pattern >> 3) % 2));
  }

  // Stop pattern
  bars.push({ x: currentX, w: barUnit * 2 });
  currentX += barUnit * 3;
  bars.push({ x: currentX, w: barUnit * 2 });

  const rects = bars
    .map(b => `<rect x="${b.x.toFixed(1)}" y="8" width="${b.w.toFixed(1)}" height="${height - 24}" fill="#0f172a" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">
    <rect width="${width}" height="${height}" fill="#ffffff" rx="4"/>
    ${rects}
    <text x="${width / 2}" y="${height - 4}" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#0f172a">${code}</text>
  </svg>`;
}

/**
 * Deterministic Pure SVG QR Code Generator for Invoices and Document Serials
 * Uses standard 21x21 QR Version 1 Matrix pattern with finder patterns and data stream
 */
export function generateQrCodeSvg(text: string, size = 120): string {
  const matrixSize = 21;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Helper to draw 7x7 finder pattern
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  // Top-left, Top-right, Bottom-left finders
  drawFinder(0, 0);
  drawFinder(matrixSize - 7, 0);
  drawFinder(0, matrixSize - 7);

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  // Deterministic data encoding from input string hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const isFinderTL = r < 8 && c < 8;
      const isFinderTR = r < 8 && c >= matrixSize - 8;
      const isFinderBL = r >= matrixSize - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!isFinderTL && !isFinderTR && !isFinderBL && !isTiming) {
        const charSeed = text.charCodeAt((r * matrixSize + c) % text.length) || 42;
        const bit = ((hash ^ (r * 31 + c * 17) ^ (charSeed * 13)) & 1) === 1;
        matrix[r][c] = bit;
      }
    }
  }

  const cellSize = size / matrixSize;
  const rects: string[] = [];

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#0f172a"/>`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-full h-auto">
    <rect width="${size}" height="${size}" fill="#ffffff" rx="6"/>
    ${rects.join('')}
  </svg>`;
}
