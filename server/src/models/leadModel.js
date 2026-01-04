import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true }, // URL actúa como identificador único
  email: String,
  phone: String,
  country: String,
  niche: String, // Agregado para almacenar el rubro de búsqueda
  type: String, // ej: "Centro de Capacitación", "Universidad"
  signals: [String], // ej: "Ofrece cursos", "Tiene checkout"
  social_media: [
    {
      network: String, // LinkedIn, Facebook, Instagram, Twitter
      followers: String, // e.g., "10k+", "5k+"
      url: String, // URL del Perfil
    },
  ],
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'pending_contact'],
    default: 'new',
  },
  // Campos del Sistema de Puntuación (simplificado - derivado de puntuaciones de IA 1-10 -> 0-100)
  scoring: {
    score: Number, // 0-100
    bucket: {
      type: String,
      enum: ['A', 'B', 'C', 'Nurture'],
    },
    lastUpdated: Date,
  },
  // Datos crudos usados para puntuación (poblados por Gemini)
  enrichment: {
    analysis_summary: String, // Spanish (LatAm)
    scores: {
      engagement: Number, // 1-10
      vertical_affinity: Number, // 1-10
      elearning_interest: Number, // 1-10
      innovation_signals: Number, // 1-10
    },
    detected_verticals: [String], // Spanish (LatAm) catalog categories that match
    final_recommendation: { type: String }, // ej: "Descartar" | "Revisar" | "Contacto prioritario"
  },
  isDeleted: { type: Boolean, default: false },
  source: { type: String, default: 'Gemini Search' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;

