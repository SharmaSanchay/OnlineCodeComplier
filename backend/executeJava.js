const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath) => {
    const fullPath = path.resolve(filepath);
    console.log("Compiling and executing Java file at filepath:", fullPath);

    return new Promise((resolve, reject) => {
        exec(`javac "${fullPath}"`, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                console.error("Compilation error:", compileError.message);
                return reject({ error: compileError.message, stderr: compileStderr });
            }
            if (compileStderr) {
                console.warn("Compilation stderr:", compileStderr);
            }
            console.log("Compilation stdout:", compileStdout);

            // Extract the directory and filename without extension
            const dir = path.dirname(fullPath);
            const fileNameWithoutExt = path.basename(fullPath, '.java');
            exec(`java -cp "${dir}" "${fileNameWithoutExt}"`, (runError, runStdout, runStderr) => {
                if (runError) {
                    console.error("Execution error:", runError.message);
                    return reject({ error: runError.message, stderr: runStderr });
                }
                if (runStderr) {
                    console.warn("Execution stderr:", runStderr);
                }
                console.log("Execution stdout:", runStdout);
                resolve(runStdout);
            });
        });
    });
};

module.exports = {
    executeJava,
};
