const input = require("input");
const sharp = require("sharp");
const fs = require("fs");
const { PromisePool } = require('@supercharge/promise-pool')
const crypto = require('crypto');

(async () => {
    const inputBuffer = fs.readFileSync(await input.text("filename"));
    const sharpObj = sharp(inputBuffer);
    const buffer = await sharpObj.resize(Number(await input.text("w")), Number(await input.text("h"))).png().toBuffer();
    fs.writeFileSync("result.png", buffer);
})();