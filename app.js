const input = require("input");
const sharp = require("sharp");
const fs = require("fs");
const { PromisePool } = require('@supercharge/promise-pool')
const crypto = require('crypto');

(async () => {
    const filename = await input.text("filename");
    const inputBuffer = fs.readFileSync(filename);
    const sharpObj = sharp(inputBuffer);
    const metadata = await sharpObj.metadata();
    const sizes = [];
    for (let w = 1; w < metadata.width; w++) {
        for (let h = 1; h < metadata.height; h++) {
            sizes.push({ w, h });
        }
    }
    console.log(sizes);
    const testBuffer = await sharpObj.resize(300, 300).png().toBuffer();
    fs.writeFileSync("test.png", testBuffer);
    const { results, errors } = await PromisePool
        .for(sizes)
        .process(async (size, index, pool) => {
            if (size.h % 20 == 0) { console.log(size) };
            const buffer = await sharpObj.resize(size.w, size.h).png().toBuffer();
            const hashHex = crypto.createHash('sha256').update(buffer, 'utf8').digest('hex');
            const cp = parseInt(hashHex.substr(0, 8), 16);
            return ({ size, cp });
        });
    results.sort((a, b) => b.cp - a.cp);
    console.log(results);

    fs.writeFileSync(filename + "-result.json", JSON.stringify(results, null, 2));
})();
