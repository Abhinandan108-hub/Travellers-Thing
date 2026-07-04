import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
const BASE_PORT = parseInt(process.env.PORT || '5000', 10);
/**
 * Attempt to listen on a port and return the port that succeeded.
 * If a port is already in use, increment and try again up to a reasonable limit.
 */
async function tryListen(startPort) {
    return new Promise((resolve, reject) => {
        const server = app.listen(startPort);

        server.once('listening', () => {
            server.removeAllListeners('error');
            resolve(startPort);
        });

        server.once('error', (err) => {
            server.close();
            reject(err);
        });
    });
}
const startServer = async () => {
    try {
        await connectDB();
        let port = BASE_PORT;
        let listeningPort = null;
        // try successive ports until one works (max 10 tries to avoid infinite loop)
        for (let i = 0; i < 10; i++) {
            try {
                listeningPort = await tryListen(port);
                break;
            }
            catch (err) {
                if (err.code === 'EADDRINUSE') {
                    console.warn(`Port ${port} in use, trying ${port + 1}...`);
                    port++;
                }
                else {
                    throw err;
                }
            }
        }
        if (listeningPort === null) {
            throw new Error('Unable to find an open port');
        }
        console.log('');
        console.log('================================================');
        console.log(`🌍 Travellers Thing API`);
        console.log(`🚀 Server running on port ${listeningPort}`);
        console.log(`🔗 http://localhost:${listeningPort}/ (root)`);
        console.log(`🔗 http://localhost:${listeningPort}/api/health`);
        console.log(`📦 Environment: ${process.env.NODE_ENV}`);
        console.log('================================================');
        console.log('');
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});
startServer();
