/**
 * QR Code Generator (ISO/IEC 18004 standard)
 * Zero-dependency, lightweight, pure TypeScript implementation.
 * Generates vector SVG path data for crisp, high-contrast QR codes.
 */

// GF(256) Galois Field Tables for polynomial multiplication
const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
let gfVal = 1
for (let i = 0; i < 255; i++) {
  GF_EXP[i] = gfVal
  GF_EXP[i + 255] = gfVal
  GF_LOG[gfVal] = i
  gfVal = (gfVal << 1) ^ (gfVal >= 128 ? 0x11d : 0)
}

function gfMul(x: number, y: number): number {
  return x === 0 || y === 0 ? 0 : GF_EXP[GF_LOG[x] + GF_LOG[y]]
}

function rsComputeRemainder(data: number[], numEcWords: number): number[] {
  // Generate generator polynomial
  let genPoly = [1]
  for (let i = 0; i < numEcWords; i++) {
    const next = Array.from({ length: genPoly.length + 1 }, () => 0)
    const factor = GF_EXP[i]
    for (let j = 0; j < genPoly.length; j++) {
      next[j] ^= genPoly[j]
      next[j + 1] ^= gfMul(genPoly[j], factor)
    }
    genPoly = next
  }

  // Polynomial division
  const result = Array.from({ length: numEcWords }, () => 0)
  for (const b of data) {
    const factor = b ^ result.shift()!
    result.push(0)
    for (let i = 0; i < numEcWords; i++) {
      result[i] ^= gfMul(genPoly[i + 1], factor)
    }
  }
  return result
}

// Table of QR code parameters for Versions 1-10 with Error Correction level 'M' (15%)
interface QrVersionSpec {
  version: number
  totalCodewords: number
  ecCodewordsPerBlock: number
  numBlocksGroup1: number
  dataCodewordsPerBlockGroup1: number
  numBlocksGroup2: number
  dataCodewordsPerBlockGroup2: number
  alignmentPositions: number[]
}

const QR_SPECS_M: QrVersionSpec[] = [
  { version: 1, totalCodewords: 26, ecCodewordsPerBlock: 10, numBlocksGroup1: 1, dataCodewordsPerBlockGroup1: 16, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [] },
  { version: 2, totalCodewords: 44, ecCodewordsPerBlock: 16, numBlocksGroup1: 1, dataCodewordsPerBlockGroup1: 28, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 18] },
  { version: 3, totalCodewords: 70, ecCodewordsPerBlock: 26, numBlocksGroup1: 1, dataCodewordsPerBlockGroup1: 44, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 22] },
  { version: 4, totalCodewords: 100, ecCodewordsPerBlock: 18, numBlocksGroup1: 2, dataCodewordsPerBlockGroup1: 32, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 26] },
  { version: 5, totalCodewords: 134, ecCodewordsPerBlock: 24, numBlocksGroup1: 2, dataCodewordsPerBlockGroup1: 43, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 30] },
  { version: 6, totalCodewords: 172, ecCodewordsPerBlock: 16, numBlocksGroup1: 4, dataCodewordsPerBlockGroup1: 27, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 34] },
  { version: 7, totalCodewords: 196, ecCodewordsPerBlock: 18, numBlocksGroup1: 4, dataCodewordsPerBlockGroup1: 31, numBlocksGroup2: 0, dataCodewordsPerBlockGroup2: 0, alignmentPositions: [6, 22, 38] },
  { version: 8, totalCodewords: 242, ecCodewordsPerBlock: 22, numBlocksGroup1: 2, dataCodewordsPerBlockGroup1: 38, numBlocksGroup2: 2, dataCodewordsPerBlockGroup2: 39, alignmentPositions: [6, 24, 42] },
  { version: 9, totalCodewords: 292, ecCodewordsPerBlock: 22, numBlocksGroup1: 3, dataCodewordsPerBlockGroup1: 36, numBlocksGroup2: 2, dataCodewordsPerBlockGroup2: 37, alignmentPositions: [6, 26, 46] },
  { version: 10, totalCodewords: 346, ecCodewordsPerBlock: 26, numBlocksGroup1: 4, dataCodewordsPerBlockGroup1: 43, numBlocksGroup2: 1, dataCodewordsPerBlockGroup2: 44, alignmentPositions: [6, 28, 50] },
]

export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder()
  const rawBytes = Array.from(encoder.encode(text))

  // Determine minimal version needed for byte mode
  let spec: QrVersionSpec | null = null
  for (const s of QR_SPECS_M) {
    const dataCapacity = s.numBlocksGroup1 * s.dataCodewordsPerBlockGroup1 + s.numBlocksGroup2 * s.dataCodewordsPerBlockGroup2
    // Header for byte mode: 4 bits mode + (version < 10 ? 8 : 16) bits length
    const headerBits = 4 + (s.version < 10 ? 8 : 16)
    const requiredBits = headerBits + rawBytes.length * 8
    if (requiredBits <= dataCapacity * 8) {
      spec = s
      break
    }
  }

  if (!spec) {
    // Fallback to highest spec
    spec = QR_SPECS_M[QR_SPECS_M.length - 1]
  }

  const dataCapacity = spec.numBlocksGroup1 * spec.dataCodewordsPerBlockGroup1 + spec.numBlocksGroup2 * spec.dataCodewordsPerBlockGroup2

  // 1. Bitstream assembly (Byte Mode = 0100)
  const bitStream: number[] = []
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >>> i) & 1)
    }
  }

  // Mode: 0100 (Byte mode)
  pushBits(0b0100, 4)
  // Character count indicator
  const charCountBits = spec.version < 10 ? 8 : 16
  pushBits(rawBytes.length, charCountBits)

  // Data bytes
  for (const b of rawBytes) {
    pushBits(b, 8)
  }

  // Terminator (up to 4 zero bits)
  const maxDataBits = dataCapacity * 8
  const terminatorLen = Math.min(4, maxDataBits - bitStream.length)
  pushBits(0, terminatorLen)

  // Pad to multiple of 8
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0)
  }

  // Convert to bytes
  const dataBytes: number[] = []
  for (let i = 0; i < bitStream.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bitStream[i + j]
    }
    dataBytes.push(byte)
  }

  // Pad bytes 0xEC and 0x11
  let padToggle = 0
  while (dataBytes.length < dataCapacity) {
    dataBytes.push(padToggle === 0 ? 0xec : 0x11)
    padToggle ^= 1
  }

  // 2. Error Correction Codewords computation
  const blocks: { data: number[]; ec: number[] }[] = []
  let dataIndex = 0

  for (let b = 0; b < spec.numBlocksGroup1; b++) {
    const d = dataBytes.slice(dataIndex, dataIndex + spec.dataCodewordsPerBlockGroup1)
    dataIndex += spec.dataCodewordsPerBlockGroup1
    const ec = rsComputeRemainder(d, spec.ecCodewordsPerBlock)
    blocks.push({ data: d, ec })
  }

  for (let b = 0; b < spec.numBlocksGroup2; b++) {
    const d = dataBytes.slice(dataIndex, dataIndex + spec.dataCodewordsPerBlockGroup2)
    dataIndex += spec.dataCodewordsPerBlockGroup2
    const ec = rsComputeRemainder(d, spec.ecCodewordsPerBlock)
    blocks.push({ data: d, ec })
  }

  // Interleave data codewords
  const interleaved: number[] = []
  const maxDataBlockLen = Math.max(spec.dataCodewordsPerBlockGroup1, spec.dataCodewordsPerBlockGroup2 || 0)
  for (let i = 0; i < maxDataBlockLen; i++) {
    for (const blk of blocks) {
      if (i < blk.data.length) {
        interleaved.push(blk.data[i])
      }
    }
  }

  // Interleave EC codewords
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (const blk of blocks) {
      interleaved.push(blk.ec[i])
    }
  }

  // 3. Grid placement
  const size = spec.version * 4 + 17
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  // Finder pattern helper
  function drawFinderPattern(startX: number, startY: number) {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const x = startX + dx
        const y = startY + dy
        if (x < 0 || x >= size || y < 0 || y >= size) continue
        isFunction[y][x] = true

        if (dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6) {
          if (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)) {
            matrix[y][x] = true
          } else {
            matrix[y][x] = false
          }
        } else {
          // Separator
          matrix[y][x] = false
        }
      }
    }
  }

  drawFinderPattern(0, 0)
  drawFinderPattern(size - 7, 0)
  drawFinderPattern(0, size - 7)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) {
      matrix[6][i] = i % 2 === 0
      isFunction[6][i] = true
    }
    if (!isFunction[i][6]) {
      matrix[i][6] = i % 2 === 0
      isFunction[i][6] = true
    }
  }

  // Alignment patterns
  const alignPos = spec.alignmentPositions
  for (let i = 0; i < alignPos.length; i++) {
    for (let j = 0; j < alignPos.length; j++) {
      const ax = alignPos[i]
      const ay = alignPos[j]
      // Skip if overlapping finder patterns
      if (
        (i === 0 && j === 0) ||
        (i === 0 && j === alignPos.length - 1) ||
        (i === alignPos.length - 1 && j === 0)
      ) {
        continue
      }
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = ax + dx
          const y = ay + dy
          isFunction[y][x] = true
          matrix[y][x] = Math.max(Math.abs(dx), Math.abs(dy)) !== 1
        }
      }
    }
  }

  // Dark module
  matrix[4 * spec.version + 9][8] = true
  isFunction[4 * spec.version + 9][8] = true

  // Reserve format information areas
  for (let i = 0; i <= 8; i++) {
    if (i < size) isFunction[i][8] = true
    if (i < size) isFunction[8][i] = true
  }
  for (let i = size - 8; i < size; i++) {
    isFunction[i][8] = true
    isFunction[8][i] = true
  }

  // Convert interleaved data into bit array
  const allBits: number[] = []
  for (const byte of interleaved) {
    for (let b = 7; b >= 0; b--) {
      allBits.push((byte >>> b) & 1)
    }
  }

  // Remainder bits for specific versions
  const remainderBitsCount = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0][spec.version] || 0
  for (let i = 0; i < remainderBitsCount; i++) {
    allBits.push(0)
  }

  // Data module placement (zigzag from bottom-right)
  let bitIndex = 0
  let right = size - 1
  while (right > 0) {
    if (right === 6) right-- // Skip vertical timing line
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const goingUp = ((right + 1) & 2) === 0
        const y = goingUp ? size - 1 - vert : vert
        if (!isFunction[y][x]) {
          matrix[y][x] = bitIndex < allBits.length ? allBits[bitIndex++] === 1 : false
        }
      }
    }
    right -= 2
  }

  // Format info for ECC 'M' (00) and Mask 0 (000) = 0x5412
  const formatInfo = 0x5412

  // Apply mask to data modules
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!isFunction[y][x]) {
        // Mask 0 condition: (x + y) % 2 === 0
        if ((x + y) % 2 === 0) {
          matrix[y][x] = !matrix[y][x]
        }
      }
    }
  }

  // Write format info bits
  for (let i = 0; i < 15; i++) {
    const bit = ((formatInfo >>> i) & 1) === 1
    // Around top-left
    if (i < 6) matrix[i][8] = bit
    else if (i === 6) matrix[7][8] = bit
    else if (i === 7) matrix[8][8] = bit
    else if (i === 8) matrix[8][7] = bit
    else matrix[8][14 - i] = bit

    // Around other finders
    if (i < 8) matrix[8][size - 1 - i] = bit
    else matrix[size - 15 + i][8] = bit
  }

  return matrix.map((row) => row.map((m) => m === true))
}

/**
 * Generates an SVG path string for the QR code modules with clean margins
 */
export function generateQrSvgPath(
  modules: boolean[][],
  margin = 3
): { path: string; size: number } {
  const moduleCount = modules.length
  const totalSize = moduleCount + margin * 2

  let path = ''
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (modules[y][x]) {
        const px = x + margin
        const py = y + margin
        path += `M${px},${py}h1v1h-1z `
      }
    }
  }

  return { path, size: totalSize }
}
