import ListsController from '#controllers/lists.js';

export const create = ListsController.create;
export const getAll = ListsController.getAll;
export const getOne = ListsController.getOne;
export const update = ListsController.update;
export const remove = ListsController.remove;
export const options = ListsController.options;

export default {
    create,
    getAll,
    getOne,
    update,
    remove,
    options,
};

