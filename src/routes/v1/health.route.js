const os = require('os');

const express = require('express');
const mongoose = require('mongoose');

const config = require('../../config/config');

const router = express.Router();

/**
 * Health check endpoint
 * GET /v1/health
 */
const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Calculate uptime
    const uptime = process.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const memoryFormatted = {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    };

    // Check environment
    const environment = config.env;

    // Determine overall status
    const overallStatus = dbStatus === 'connected' ? 'OK' : 'WARNING';

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      environment,
      version: process.env.npm_package_version || '1.7.0',
      services: {
        database: dbStatus,
        server: 'running',
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: memoryFormatted,
        cpuCount: os.cpus().length,
      },
    };

    const statusCode = overallStatus === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

/**
 * Detailed health check with database ping
 * GET /v1/health/detailed
 */
const detailedHealthCheck = async (req, res) => {
  try {
    // Test database connection with ping
    let dbPing = 'unknown';
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = 'success';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      dbPing = 'failed';
    }

    // Check all environment variables (without exposing sensitive data)
    const envCheck = {
      NODE_ENV: config.env,
      PORT: config.port,
      MONGODB_URL: config.mongoose.url ? 'configured' : 'missing',
      JWT_SECRET: config.jwt.secret ? 'configured' : 'missing',
      SMTP_HOST: config.email.smtp.host ? 'configured' : 'missing',
      GOOGLE_CLIENT_ID: config.google.clientId ? 'configured' : 'missing',
      OPENAI_API_KEY: config.openai ? 'configured' : 'missing',
    };

    const detailedData = {
      status: dbPing === 'success' ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
      environment: config.env,
      version: process.env.npm_package_version || '1.7.0',
      services: {
        database: {
          status: dbPing,
          connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        },
        server: 'running',
      },
      configuration: envCheck,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        },
        cpuCount: os.cpus().length,
        loadAverage: os.loadavg(),
      },
    };

    const statusCode = dbPing === 'success' ? 200 : 503;
    res.status(statusCode).json(detailedData);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

router.get('/', healthCheck);
router.get('/detailed', detailedHealthCheck);

module.exports = router;
