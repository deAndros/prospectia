export default {
    Lead: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            url: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            country: { type: 'string' },
            niche: { type: 'string' },
            type: { type: 'string' },
            signals: {
                type: 'array',
                items: { type: 'string' }
            },
            social_media: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        network: { type: 'string' },
                        followers: { type: 'string' },
                        url: { type: 'string' }
                    }
                }
            },
            status: {
                type: 'string',
                enum: ['new', 'contacted', 'interested', 'pending_contact']
            },
            scoring: {
                type: 'object',
                properties: {
                    score: { type: 'number' },
                    bucket: {
                        type: 'string',
                        enum: ['A', 'B', 'C', 'Nurture']
                    },
                    lastUpdated: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            },
            enrichment: {
                type: 'object',
                properties: {
                    analysis_summary: { type: 'string' },
                    scores: {
                        type: 'object',
                        properties: {
                            engagement: { type: 'number' },
                            vertical_affinity: { type: 'number' },
                            elearning_interest: { type: 'number' },
                            innovation_signals: { type: 'number' }
                        }
                    },
                    detected_verticals: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    final_recommendation: { type: 'string' }
                }
            },
            isDeleted: { type: 'boolean' },
            source: { type: 'string' },
            notes: { type: 'string' },
            createdAt: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    List: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            prospects: {
                type: 'array',
                items: { type: 'string' }
            },
            status: {
                type: 'string',
                enum: ['Active', 'Inactive']
            },
            createdBy: { type: 'string' },
            filter: {
                type: 'object',
                properties: {
                    country: { type: 'string' },
                    niche: { type: 'string' },
                    scoreMin: { type: 'number' },
                    scoreMax: { type: 'number' }
                }
            },
            createdAt: {
                type: 'string',
                format: 'date-time'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    ArrayString: {
        type: 'array',
        uniqueItems: true,
        items: { type: 'string' }
    },
    ArrayNumber: {
        type: 'array',
        uniqueItems: true,
        items: { type: 'integer' }
    },
    ID: { type: 'string' },
    Date: {
        type: 'string',
        format: 'date'
    },
    DateTime: {
        type: 'string',
        format: 'date-time'
    },
    Error: {
        type: 'object',
        properties: {
            code: {
                type: 'integer',
                format: 'int32'
            },
            message: { type: 'string' }
        }
    }
};
