const { exec } = require("child_process");
const path = require("path");

const executePy = (filepath) => {
    // Resolve the full path to avoid issues with relative paths
    const fullPath = path.resolve(filepath);
    console.log("Executing Python script at filepath:", fullPath);

    return new Promise((resolve, reject) => {
        exec(`py "${fullPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error("Execution error:", error.message);
                return reject({ error: error.message, stderr });
            }
            if (stderr) {
                console.warn("Execution stderr:", stderr);
            }
            console.log("Execution stdout:", stdout);
            resolve(stdout);
        });
    });
};

module.exports = {
    executePy,
};