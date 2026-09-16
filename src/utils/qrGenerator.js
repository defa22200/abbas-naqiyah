import QRCode from 'qrcode';

/**
 * Generates an ultra-crisp custom SVG string for a QR code
 * Styled with our wedding palette: warm espresso modules + gold finder patterns.
 */
export function generateStyledQrSvg(text, options = {}) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const data = qr.modules.data;

  const fgColor = options.fgColor || '#322723';
  const goldColor = options.goldColor || '#C7A86B';
  const bgColor = options.bgColor || '#FAF7F2';

  const viewBoxSize = size + 4; // 2 module padding
  let rects = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r * size + c]) {
        // Check if this is part of the 3 corner finder patterns (7x7 corners)
        const isTopLeft = r < 7 && c < 7;
        const isTopRight = r < 7 && c >= size - 7;
        const isBottomLeft = r >= size - 7 && c < 7;

        const isFinder = isTopLeft || isTopRight || isBottomLeft;
        const color = isFinder ? goldColor : fgColor;
        const rx = isFinder ? 0.3 : 0.2;

        rects.push(
          `<rect x="${c + 2}" y="${r + 2}" width="1.01" height="1.01" rx="${rx}" fill="${color}" />`
        );
      }
    }
  }

  return `
    <svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <rect width="100%" height="100%" fill="${bgColor}" rx="1" />
      ${rects.join('')}
    </svg>
  `;
}
