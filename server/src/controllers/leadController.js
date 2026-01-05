import * as leadsService from '#services/leadService.js';
import logger from '#helpers/logger.js';

/**
 * Descubrir prospectos
 */
export const discover = async (req, res, next) => {
    try {
        const { country, niche, maxResults } = req.body;

        if (!country || !niche) {
            return res.status(400).json({ 
                error: 'Country and Niche are required' 
            });
        }

        const discoveredLeads = await leadsService.discoverLeads(
            country,
            niche,
            maxResults || 5
        );

        res.json({
            success: true,
            leads: discoveredLeads,
        });
    } catch (error) {
        logger.error('Error in discover leads:', error);
        
        if (error.code === 'QUOTA_EXCEEDED') {
            return res.status(429).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message 
        });
    }
};

/**
 * Guardar prospectos
 */
export const save = async (req, res, next) => {
    try {
        const { leads, country, niche, overwrite } = req.body;

        const result = await leadsService.saveLeads(leads, country, niche, overwrite);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        logger.error('Error in save leads:', error);
        res.status(500).json({ error: 'Failed to save leads' });
    }
};

/**
 * Obtener todos los prospectos
 */
export const getAll = async (req, res, next) => {
    try {
        const leads = await leadsService.getAllLeads();
        res.json(leads);
    } catch (error) {
        logger.error('Error in get all leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
};

/**
 * Actualizar prospecto
 */
export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const lead = await leadsService.updateLead(id, updateData);

        res.json({ success: true, lead });
    } catch (error) {
        logger.error('Error in update lead:', error);
        
        if (error.message === 'Lead not found') {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        res.status(500).json({ error: 'Failed to update lead' });
    }
};

/**
 * Eliminar prospecto (lógico)
 */
export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;

        await leadsService.deleteLead(id);

        res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
        logger.error('Error in delete lead:', error);
        
        if (error.message === 'Lead not found') {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        res.status(500).json({ error: 'Failed to delete lead' });
    }
};

/**
 * Analizar prospecto con IA
 */
export const analyze = async (req, res, next) => {
    try {
        const { id } = req.params;

        const lead = await leadsService.analyzeLead(id);

        res.json({ success: true, lead });
    } catch (error) {
        logger.error('Error in analyze lead:', error);
        
        if (error?.code === 'QUOTA_EXCEEDED') {
            return res.status(429).json({ error: error.message });
        }
        
        if (error.message === 'Lead not found') {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        res.status(502).json({
            error: error?.message || 
                'No se pudo completar el análisis automáticamente. Intenta nuevamente.',
        });
    }
};

/**
 * Obtener filtros disponibles
 */
export const getFilters = async (req, res, next) => {
    try {
        const filters = await leadsService.getFilters();
        res.json({
            success: true,
            filters,
        });
    } catch (error) {
        logger.error('Error in get filters:', error);
        res.status(500).json({ error: 'Failed to fetch filters' });
    }
};

export default {
    discover,
    save,
    getAll,
    update,
    remove,
    analyze,
    getFilters,
};
