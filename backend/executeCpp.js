const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    console.log(jobId)
    return new Promise((resolve, reject) => {
        exec(
            `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && "${jobId}.exe"`,
            (error, stdout, stderr) => {
                if (error) {
                    return reject({ error, stderr });
                }
                if (stderr) {
                    return reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeCpp,
};