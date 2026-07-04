import fs from 'fs';
import path from 'path';
const logsDir = path.join(__dirname, '..', 'logs');
const files = {
    error: path.join(logsDir, 'error.log'),
    combined: path.join(logsDir, 'combined.log'),
    requests: path.join(logsDir, 'requests.log'),
    exceptions: path.join(logsDir, 'exceptions.log'),
};
function ensureLogsDir() {
    if (!fs.existsSync(logsDir))
        fs.mkdirSync(logsDir, { recursive: true });
}
function append(filePath, message) {
    try {
        ensureLogsDir();
        const line = `${new Date().toISOString()} ${message}\n`;
        fs.appendFileSync(filePath, line);
    }
    catch (err) {
        // fallback to console if writing fails
        // eslint-disable-next-line no-console
        console.error('Failed to write log', err);
    }
}
export const logInfo = (msg) => {
    append(files.combined, `[INFO] ${msg}`);
    // eslint-disable-next-line no-console
    console.log(msg);
};
export const logError = (msg) => {
    append(files.error, `[ERROR] ${msg}`);
    append(files.combined, `[ERROR] ${msg}`);
    // eslint-disable-next-line no-console
    console.error(msg);
};
export const logRequest = (method, url, meta = {}) => {
    append(files.requests, `[REQUEST] ${method} ${url} ${JSON.stringify(meta)}`);
};
export const logException = (err) => {
    const stack = err && err.stack ? err.stack : String(err);
    append(files.exceptions, `[EXCEPTION] ${stack}`);
    append(files.combined, `[EXCEPTION] ${stack}`);
    // eslint-disable-next-line no-console
    console.error(stack);
};
export default { logInfo, logError, logRequest, logException };
