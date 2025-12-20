import { packageJson } from '#util/index.js';

const pkg = packageJson();

/**
 * Ping - returns version
 */
export const ping = (req, res) => {
    res.json({ version: pkg.version });
};

/**
 * Get status - health check
 */
export const getStatus = async (req, res) => {
    res.json({
        name: pkg.name,
        status: 'OK',
        deps: []
    });
};

/**
 * Get health - simple health check
 */
export const getHealth = (req, res) => {
    res.json({
        name: pkg.name,
        status: 'OK'
    });
};

export default {
    ping,
    getStatus,
    getHealth
};
