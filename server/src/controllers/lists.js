import * as listsService from '#services/lists.js';
import logger from '#helpers/logger.js';

export const create = async (req, res) => {
    try {
        const list = await listsService.createList({ ...req.body, createdBy: req.user?._id });
        res.status(201).json({ success: true, list });
    } catch (error) {
        logger.error('Error creating list:', error);
        res.status(400).json({ error: error.message || 'Failed to create list' });
    }
};

export const getAll = async (_req, res) => {
    try {
        const lists = await listsService.getLists();
        res.json(lists);
    } catch (error) {
        logger.error('Error fetching lists:', error);
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
};

export const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await listsService.getListById(id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        res.json(list);
    } catch (error) {
        logger.error('Error fetching list:', error);
        res.status(500).json({ error: 'Failed to fetch list' });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await listsService.updateList(id, req.body);
        res.json({ success: true, list });
    } catch (error) {
        logger.error('Error updating list:', error);
        if (error.message === 'List not found') {
            return res.status(404).json({ error: 'List not found' });
        }
        res.status(400).json({ error: error.message || 'Failed to update list' });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await listsService.deleteList(id);
        res.json({ success: true, message: 'List deleted successfully' });
    } catch (error) {
        logger.error('Error deleting list:', error);
        if (error.message === 'List not found') {
            return res.status(404).json({ error: 'List not found' });
        }
        res.status(500).json({ error: 'Failed to delete list' });
    }
};

export const options = async (_req, res) => {
    try {
        const data = await listsService.getListOptions();
        res.json(data);
    } catch (error) {
        logger.error('Error fetching list options:', error);
        res.status(500).json({ error: 'Failed to fetch list options' });
    }
};

export default {
    create,
    getAll,
    getOne,
    update,
    remove,
    options,
};

