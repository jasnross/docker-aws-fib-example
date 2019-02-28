"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = function () { return ({
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: Number(process.env.REDIS_PORT || '6380'),
    pgUser: process.env.PGUSER || '',
    pgHost: process.env.PGHOST || '',
    pgDatabase: process.env.PGDATABASE || '',
    pgPassword: process.env.PGPASSWORD || '',
    pgPort: Number(process.env.PGPORT || '5432'),
}); };
