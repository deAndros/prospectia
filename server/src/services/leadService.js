import mongoose from 'mongoose';
import Lead from '#models/leadModel.js';
import * as geminiService from './geminiService.js';

/**
 * Descubrir prospectos usando IA Gemini
 */
export const discoverLeads = async (country, niche, maxResults = 5) => {
    return await geminiService.discoverLeads(country, niche, maxResults);
};

/**
 * Guardar múltiples prospectos en la base de datos
 */
export const saveLeads = async (leadsData, country, niche, overwrite = false) => {
    if (!Array.isArray(leadsData) || leadsData.length === 0) {
        throw new Error('Leads array is required and must not be empty');
    }

    let newCount = 0;
    let updatedCount = 0;
    const duplicates = [];

    // Obtener todas las URLs de los prospectos entrantes
    const urls = leadsData
        .map((l) => String(l?.url || '').trim())
        .filter(Boolean);

    // Encontrar prospectos existentes con estas URLs
    const existing = urls.length
        ? await Lead.find({ url: { $in: urls } })
              .select('_id url name isDeleted')
              .lean()
        : [];

    const existingByUrl = new Map(existing.map((doc) => [doc.url, doc]));

    const ops = [];

    for (const leadData of leadsData) {
        const url = String(leadData?.url || '').trim();
        if (!url) continue;

        const existingDoc = existingByUrl.get(url);
        
        // Si existe y no se sobrescribe, agregar a duplicados
        if (existingDoc && !overwrite) {
            duplicates.push({
                url,
                existing: {
                    _id: existingDoc._id,
                    name: existingDoc.name,
                    isDeleted: !!existingDoc.isDeleted,
                },
                incoming: { name: leadData.name },
            });
            continue;
        }

        // Operación upsert
        ops.push({
            updateOne: {
                filter: { url },
                update: {
                    $set: {
                        name: leadData.name,
                        email: leadData.email,
                        phone: leadData.phone,
                        country: country || leadData.country || 'Unknown',
                        niche: niche || leadData.niche || 'General',
                        type: leadData.type,
                        signals: leadData.signals,
                        social_media: leadData.social_media || [],
                        isDeleted: false, // revivir si fue eliminado lógicamente
                    },
                    $setOnInsert: { status: 'new' },
                },
                upsert: true,
            },
        });
    }

    if (ops.length > 0) {
        const bulkResult = await Lead.bulkWrite(ops, { ordered: false });
        newCount = bulkResult?.upsertedCount || 0;
        updatedCount = bulkResult?.modifiedCount || 0;
    }

    return {
        stats: { new: newCount, updated: updatedCount },
        duplicates,
    };
};

/**
 * Obtener todos los prospectos (excluyendo eliminados)
 */
export const getAllLeads = async () => {
    return await Lead.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
};

/**
 * Obtener prospecto por ID
 */
export const getLeadById = async (id) => {
    return await Lead.findById(id);
};

/**
 * Actualizar prospecto
 */
export const updateLead = async (id, updateData) => {
    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    if (!lead) {
        throw new Error('Lead not found');
    }
    return lead;
};

/**
 * Eliminar prospecto (eliminación lógica)
 */
export const deleteLead = async (id) => {
    // 1. Marcar como eliminado lógicamente
    const lead = await Lead.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    if (!lead) {
        throw new Error('Lead not found');
    }

    // 2. Eliminar de todas las listas
    const List = mongoose.model('List');
    await List.updateMany(
        { prospects: id },
        { $pull: { prospects: id } }
    );

    return lead;
};

/**
 * Analizar prospecto usando IA Gemini
 */
export const analyzeLead = async (id) => {
    const lead = await Lead.findById(id);
    if (!lead) {
        throw new Error('Lead not found');
    }

    // Obtener datos de enriquecimiento de Gemini
    const enrichmentData = await geminiService.analyzeLead(lead);

    // Validar datos de enriquecimiento
    const s = enrichmentData?.scores;
    const hasScores =
        s &&
        typeof s.engagement === 'number' &&
        typeof s.vertical_affinity === 'number' &&
        typeof s.elearning_interest === 'number' &&
        typeof s.innovation_signals === 'number';

    if (!enrichmentData?.analysis_summary || !hasScores) {
        throw new Error(
            'No se pudo completar el análisis automáticamente. Intenta nuevamente.'
        );
    }

    // Calcular puntaje general
    const sum =
        (Number(s.engagement) || 0) +
        (Number(s.vertical_affinity) || 0) +
        (Number(s.elearning_interest) || 0) +
        (Number(s.innovation_signals) || 0);
    const score = Math.max(0, Math.min(100, Math.round((sum / 40) * 100)));

    // Determinar categoría (bucket)
    let bucket = 'Nurture';
    if (score >= 80) bucket = 'A';
    else if (score >= 60) bucket = 'B';
    else if (score >= 40) bucket = 'C';

    // Actualizar prospecto con enriquecimiento y puntaje
    lead.enrichment = enrichmentData;
    lead.scoring = {
        score,
        bucket,
        lastUpdated: new Date(),
    };

    await lead.save();

    return lead;
};

/**
 * Obtener filtros (países y rubros disponibles)
 */
export const getFilters = async () => {
    const [countries, niches] = await Promise.all([
        Lead.distinct('country', { isDeleted: { $ne: true } }),
        Lead.distinct('niche', { isDeleted: { $ne: true } }),
    ]);

    return {
        countries: countries.filter(Boolean).sort(),
        niches: niches.filter(Boolean).sort(),
    };
};

export default {
    discoverLeads,
    saveLeads,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,
    analyzeLead,
    getFilters,
};
