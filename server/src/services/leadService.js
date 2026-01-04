import mongoose from 'mongoose';
import Lead from '#models/leadModel.js';
import * as geminiService from './geminiService.js';

/**
 * Discover leads using Gemini AI
 */
export const discoverLeads = async (country, niche, maxResults = 5) => {
    return await geminiService.discoverLeads(country, niche, maxResults);
};

/**
 * Save multiple leads to database
 */
export const saveLeads = async (leadsData, country, niche, overwrite = false) => {
    if (!Array.isArray(leadsData) || leadsData.length === 0) {
        throw new Error('Leads array is required and must not be empty');
    }

    let newCount = 0;
    let updatedCount = 0;
    const duplicates = [];

    // Get all URLs from incoming leads
    const urls = leadsData
        .map((l) => String(l?.url || '').trim())
        .filter(Boolean);

    // Find existing leads with these URLs
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
        
        // If exists and not overwriting, add to duplicates
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

        // Upsert operation
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
                        isDeleted: false, // revive if it was logically deleted
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
 * Get all leads (excluding deleted)
 */
export const getAllLeads = async () => {
    return await Lead.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
};

/**
 * Get lead by ID
 */
export const getLeadById = async (id) => {
    return await Lead.findById(id);
};

/**
 * Update lead
 */
export const updateLead = async (id, updateData) => {
    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    if (!lead) {
        throw new Error('Lead not found');
    }
    return lead;
};

/**
 * Delete lead (logical delete)
 */
export const deleteLead = async (id) => {
    // 1. Mark as logically deleted
    const lead = await Lead.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );
    if (!lead) {
        throw new Error('Lead not found');
    }

    // 2. Remove from all lists
    const List = mongoose.model('List');
    await List.updateMany(
        { prospects: id },
        { $pull: { prospects: id } }
    );

    return lead;
};

/**
 * Analyze lead using Gemini AI
 */
export const analyzeLead = async (id) => {
    const lead = await Lead.findById(id);
    if (!lead) {
        throw new Error('Lead not found');
    }

    // Get enrichment data from Gemini
    const enrichmentData = await geminiService.analyzeLead(lead);

    // Validate enrichment data
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

    // Calculate overall score
    const sum =
        (Number(s.engagement) || 0) +
        (Number(s.vertical_affinity) || 0) +
        (Number(s.elearning_interest) || 0) +
        (Number(s.innovation_signals) || 0);
    const score = Math.max(0, Math.min(100, Math.round((sum / 40) * 100)));

    // Determine bucket
    let bucket = 'Nurture';
    if (score >= 80) bucket = 'A';
    else if (score >= 60) bucket = 'B';
    else if (score >= 40) bucket = 'C';

    // Update lead with enrichment and scoring
    lead.enrichment = enrichmentData;
    lead.scoring = {
        score,
        bucket,
        lastUpdated: new Date(),
    };

    await lead.save();

    return lead;
};

export default {
    discoverLeads,
    saveLeads,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,
    analyzeLead,
};
