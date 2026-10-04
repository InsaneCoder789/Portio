import sharp from "sharp";

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error("Usage: node scripts/export-project-card.mjs source destination.webp");
// Normalize export dimensions only; preserve the complete approved artwork.
const { width, height, size } = await sharp(source).resize(1600, 900, { fit: "contain", background: "#10151c" }).webp({ quality: 88 }).toFile(destination);
if (width !== 1600 || height !== 900) throw new Error("Project card must be 16:9");
console.log(JSON.stringify({ destination, width, height, bytes: size }));
