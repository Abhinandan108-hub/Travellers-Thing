import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const BASE_PORT = parseInt(process.env.PORT || '5000', 10);

/**
 * Attempt to listen on a port and return the port that succeeded.
 * If a port is already in use, increment and try again up to a reasonable limit.
 */
async function tryListen(startPort: number): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const server = app
      .listen(startPort)
      .once('listening', () => {
        server.removeAllListeners('error');
        resolve(startPort);
      })
      .once('error', (err: NodeJS.ErrnoException) => {
        server.close();
        reject(err);
      });
  });
}

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    let port = BASE_PORT;
    let listeningPort: number | null = null;

    // try successive ports until one works (max 10 tries to avoid infinite loop)
    for (let i = 0; i < 10; i++) {
      try {
        listeningPort = await tryListen(port);
        break;
      } catch (err: any) {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} in use, trying ${port + 1}...`);
          port++;
        } else {
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
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();