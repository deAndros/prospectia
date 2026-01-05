import LeadsController from '#controllers/leadController.js';

export const discover = LeadsController.discover;
export const save = LeadsController.save;
export const getAll = LeadsController.getAll;
export const update = LeadsController.update;
export const remove = LeadsController.remove;
export const analyze = LeadsController.analyze;
export const getFilters = LeadsController.getFilters;

export default {
    discover,
    save,
    getAll,
    update,
    remove,
    analyze,
    getFilters
};
