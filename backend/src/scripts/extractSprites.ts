import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";

// Sample usage: npx ts-node --transpile-only src/scripts/extractSprites.ts C:\path\to\sheet1.png 1 C:\path\to\output\
// Sample usage for smaller sheet: npx ts-node --transpile-only src/scripts/extractSprites.ts C:\path\to\lastsheet.png 351 C:\path\to\output\ 15
const COLS = 10;
const ROWS = 5;
const CARDS_PER_SHEET = COLS * ROWS; // 50

// The text at the bottom of each sheet takes up roughly this many pixels.
// We exclude it before dividing the remaining height into rows.
const WATERMARK_HEIGHT = 28;

async function main() {
    const [, , sheetPath, startCardStr, outputDir, countStr] = process.argv;
    if (!sheetPath || !startCardStr || !outputDir) {
        console.error("Usage: npx ts-node src/scripts/extractSprites.ts <spritesheet.png> <startCardNumber> <outputDir> [cardCount]");
        console.error("Example (full sheet):    npx ts-node src/scripts/extractSprites.ts sheet1.png 1 output/");
        console.error("Example (partial sheet): npx ts-node src/scripts/extractSprites.ts sheet8.png 351 output/ 15");
        process.exit(1);
    }

    const startCard = parseInt(startCardStr, 10);
    if (isNaN(startCard)) {
        console.error("startCardNumber must be an integer, e.g. 1, 51, 101");
        process.exit(1);
    }

    // Optional card count for partial sheets (e.g. the last sheet with fewer than 50 cards).
    // Determines how many rows are actually in the image so yStride is computed correctly.
    const cardCount = countStr ? parseInt(countStr, 10) : CARDS_PER_SHEET;
    const activeRows = Math.ceil(cardCount / COLS);

    // Read the actual image dimensions so the script adapts to any sheet size.
    const resolvedSheet = path.resolve(sheetPath);
    const metadata = await sharp(resolvedSheet).metadata();
    const imageWidth = metadata.width!;
    const imageHeight = metadata.height!;

    // Divide the image evenly by the grid size.
    // Floor ensures we never try to read pixels outside the image boundary.
    // xStride/yStride are used for positioning — they span the full cell including the border gap.
    // cardWidth/cardHeight are the actual extraction size — 2px smaller to exclude the border.
    const xStride = Math.floor(imageWidth / COLS);
    const yStride = Math.floor((imageHeight - WATERMARK_HEIGHT) / activeRows);
    const cardWidth = xStride + 1;  // +1 compensates for Math.floor rounding down the stride
    const cardHeight = yStride - 2;

    console.log(`Sheet dimensions: ${imageWidth}x${imageHeight} → card size: ${cardWidth}x${cardHeight}px`);

    const resolvedOutput = path.resolve(outputDir);
    mkdirSync(resolvedOutput, { recursive: true });

    for (let row = 0; row < activeRows; row++) {
        for (let col = 0; col < COLS; col++) {
            const cardNumber = startCard + row * COLS + col;
            if (cardNumber > startCard + cardCount - 1) break;
            const x = col * xStride;
            const y = row * yStride;
            const outputFile = path.join(resolvedOutput, `${String(cardNumber).padStart(3, "0")}.png`);

            await sharp(resolvedSheet)
                .extract({ left: x, top: y, width: Math.min(cardWidth, imageWidth - x), height: cardHeight })
                .toFile(outputFile);
        }
    }

    const endCard = startCard + CARDS_PER_SHEET - 1;
    console.log(`✅ Extracted cards ${startCard}–${endCard} to ${resolvedOutput}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});