import LeadsController from '#controllers/leads.js';

export const discover = LeadsController.discover;
export const save = LeadsController.save;
export const getAll = LeadsController.getAll;
export const update = LeadsController.update;
export const remove = LeadsController.remove;
export const analyze = LeadsController.analyze;

export default {
    discover,
    save,
    getAll,
    update,
    remove,
    analyze
};
