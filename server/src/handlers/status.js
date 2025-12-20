import StatusController from '#controllers/status.js';

export const ping = StatusController.ping;
export const getStatus = StatusController.getStatus;
export const getHealth = StatusController.getHealth;

export default {
    ping,
    getStatus,
    getHealth
};
