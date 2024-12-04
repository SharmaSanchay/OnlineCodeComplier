const fs = require("fs");
const path = require('path');
const dircodes = path.join(__dirname, "codes");
const { v4: uuid } = require("uuid");
if (!fs.existsSync(dircodes)) {
    fs.mkdirSync(dircodes, { recursive: true });
}
const generatefile = async (format, code) => {
    const jobId = uuid();
    const filename = `${jobId}.${format}`
    const filepath = path.join(dircodes, filename);
    console.log("filename:",filename,"filepath:",filepath)
    await fs.writeFileSync(filepath, code);
    return filepath;
}
module.exports = {
    generatefile
}