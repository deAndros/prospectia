import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true }, // URL acts as unique identifier
  email: String,
  phone: String,
  country: String,
  niche: String, // Added to store search niche
  type: String, // e.g., "Training Center", "University"
  signals: [String], // e.g., "Offers courses", "Has checkout"
  social_media: [
    {
      network: String, // LinkedIn, Facebook, Instagram, Twitter
      followers: String, // e.g., "10k+", "5k+"
      url: String, // Profile URL
    },
  ],
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'pending_contact'],
    default: 'new',
  },
  // Scoring System Fields (simplified - derived from AI 1-10 scores -> 0-100)
  scoring: {
    score: Number, // 0-100
    bucket: {
      type: String,
      enum: ['A', 'B', 'C', 'Nurture'],
    },
    lastUpdated: Date,
  },
  // Raw data used for scoring (populated by Gemini)
  enrichment: {
    analysis_summary: String, // Spanish (LatAm)
    scores: {
      engagement: Number, // 1-10
      vertical_affinity: Number, // 1-10
      elearning_interest: Number, // 1-10
      innovation_signals: Number, // 1-10
    },
    detected_verticals: [String], // Spanish (LatAm) catalog categories that match
    final_recommendation: { type: String }, // e.g. "Descartar" | "Revisar" | "Contacto prioritario"
  },
  isDeleted: { type: Boolean, default: false },
  source: { type: String, default: 'Gemini Search' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;

