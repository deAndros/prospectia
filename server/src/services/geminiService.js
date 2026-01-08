import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const discoverLeads = async (country, niche, maxResults = 5) => {
  try {
    // selección robusta de modelo
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      apiVersion: 'v1beta',
      tools: [
        {
          googleSearch: {},
        },
      ],
    })
    
    //TODO:Evaluar posibilidad de determinar fecha de ultima publicación en cada red social esto es para evaluar si la entidad está activa o no en la red social.
    const prompt = `
      Encuentra ${maxResults} organizaciones, instituciones, empresas y/o entidades oriundas de ${country} que operen en el rubro "${niche}" y que puedan estar interesadas en vender cursos de e-learning. 
      
      Para cada entidad encontrada, extrae:
      - Nombre oficial
      - URL del sitio web oficial si lo tiene
      - Email de contacto si lo tiene
      - Teléfono de contacto si lo tiene
      - Tipo de organización (ej: Universidad, Consultora)
      - Social media: Array de objetos (ver abajo).
      - Señales clave (por qué coinciden).
      
      FILTRO DE INFORMACIÓN:
      - Para cada entidad encontrada, si NO encuentras sitio web oficial, devuelve "url": null.
      - Para cada entidad encontrada, si NO encuentras redes sociales asociadas a esa entidad, devuelve "social_media": [].
      - No inventes urls de redes sociales, asegurate que las redes sociales sean perfiles activos y que estén asociados a la entidad.
      
      REDES SOCIALES:
      - Busca mediante scraping en los sitios web oficiales de las entidades encontradas los perfiles en las redes socialdes (Linkedin, Youtube, Instagram, Facebook, TikTok) de cada una. Si no encuentras alguno, no lo agregues, las url de las redes sociales deben extraerse si o si del sitio web oficial de cada entidad/prospecto (no inventar/alucinar una url).
      - **ESTIMA LA CANTIDAD DE SEGUIDORES DE CADA RED SOCIAL ENCONTRADA**: Estima una cantidad de seguidores para cada red social y añadelo al campo "followers" que retornas para esa red social. Por ejemplo:
                {
                    "network": "LinkedIn",
                    "url": "https://www.linkedin.com/{perfil oficial de la entidad}}",
                    "followers": "15k +"
                }
      - FORMATO DE RESPUESTA: Array de objetos.
      - Ejemplo: "social_media": [{ "network": "LinkedIn", "url": "...", "followers": "15k+" }]

      Devuelve el resultado ESTRICTAMENTE como un array JSON de objetos con las claves: 
      name, url, email, phone, country, niche, type, social_media, signals.
      
      No incluyas markdown ni explicaciones, solo el string JSON válido.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Limpiar posible formato markdown en la respuesta (```json ... ```)
    const jsonStr = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    let leads = JSON.parse(jsonStr)

    // FILTRADO PROGRAMÁTICO (El "Enforcer")
    // Filtrar prospectos que no cumplen con criterios estrictos:
    // 1. Debe tener una URL oficial (no nulo)
    // 2. Debe tener al menos un perfil de red social
    const filteredLeads = leads.filter((lead) => {
      const hasUrl = typeof lead?.url === 'string' && lead.url.trim().length > 0
      // Requerimos una URL oficial porque la unicidad + selección en la UI depende de `url`.
      return hasUrl
    })

    // Sanitizar prospectos para asegurar que los campos críticos estén en el formato esperado
    return filteredLeads.map((lead) => ({
      ...lead,
      signals: Array.isArray(lead.signals) ? lead.signals : [],
    }))
  } catch (error) {
    if (
      error.message.includes('429') ||
      error.message.includes('Resource has been exhausted')
    ) {
      throw {
        code: 'QUOTA_EXCEEDED',
        message: 'Free tier quota exceeded. Please try again in a few minutes.',
      }
    }
    throw new Error('Failed to discover leads via Gemini.')
  }
}


//TODO: Implementar la posibilidad de incluir en el wizard prospectos sin score
//TODO: Brindar posibilidad de recalcular score de lead en caso de que el agente cambie las redes sociales y ponga las correctas
export const analyzeLead = async (lead) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      apiVersion: 'v1beta',
      tools: [{ googleSearch: {} }],
    })

    const prompt = `
      Act as a Senior Business Development Analyst.

**YOUR CONTEXT (Who you represent):**
You represent the "Centro de E-Learning", a higher education institution that offers professional online courses and diplomas.
**Our Catalog Categories (Spanish / LatAm):** Administración de Empresas, Derecho y Ciencias Sociales, Gestión Deportiva, Desarrollo Personal, Diseño/Multimedia, Educación/Capacitación, Idiomas, Industria/Energía/Construcción, IT y Programación, Marketing, Salud/Medicina, Turismo/Hospitalidad.

**THE GOAL (What is a Partner?):**
We are looking for "Partners". A Partner is a third-party organization (company, influencer, association, or media outlet) that wants to **resell our courses** to their own audience via their own website/e-shop.
The ideal partner has:
1. An active audience (Engagement).
2. A niche compatible with our catalog (Vertical Affinity).
3. An interest in selling training (E-learning Interest).
4. A modern mindset (Innovation).

**YOUR TASK:**
I will provide you with data about a "Lead" (a potential partner). You must analyze it and score it from 1 to 10 on specific criteria based on the context above.

### LEAD DATA:
- **Name:** ${lead.name}
- **URL:** ${lead.url}
- **Description:** ${lead.description || 'Not available'}
- **Niche:** ${lead.niche}
- **Country:** ${lead.country}

### SCORING RUBRIC (1-10):

**1. Community Engagement (1-10):**
Does this entity have an active audience in their social media profiles to whom they can sell our courses?
- 1-3: Static website, no visible community or interaction.
- 4-6: Moderate presence, occasional posts.
- 7-10: Very active community, recent comments, visible testimonials, high estimated traffic/influence.

**2. Vertical Affinity (1-10):**
Does their audience match our Catalog Categories listed in "YOUR CONTEXT"?
- 1-3: No clear relationship (e.g., a website selling tires vs. our academic courses).
- 4-6: Tangential relationship.
- 7-10: Strong match. Their audience is looking for exactly what we teach (e.g., an HR consultancy matches perfectly with our "Business Administration" courses).

**3. E-Learning Interest (1-10):**
Do they already show intent to offer training?
- 1-3 (None/Low): No mention of training/courses on their site.
- 4-6 (Mention): Mentions "training" or "workshops" but without structure.
- 7-8 (Page): Has a dedicated landing page for courses/services.
- 9-10 (Catalog): Has an active course catalog, academy, or e-commerce for education.

**4. Innovation Signals (1-10):**
Do they mention tech terms? (AI, Machine Learning, Digital Transformation, Automation, Blockchain).
- 1: No mentions.
- 5: Generic tech mentions.
- 10: Innovation is core to their business value.

### REQUIRED OUTPUT FORMAT (JSON ONLY):
Return strictly a JSON object with the following structure (keys in English).
Important: values intended for display to end-users MUST be in Spanish (LatAm), specifically:
- "analysis_summary" must be Spanish (LatAm), 2 sentences.
- "detected_verticals" must use the Spanish catalog category names provided above.
- "final_recommendation" must be one of: Descartar | Revisar | Contacto prioritario

{
  "analysis_summary": "A brief 2-sentence justification of the partner potential.",
  "scores": {
    "engagement": 0,
    "vertical_affinity": 0,
    "elearning_interest": 0,
    "innovation_signals": 0
  },
  "detected_verticals": ["List of 'Our Catalog Categories' that match this lead"],
  "final_recommendation": "Select one: Descartar | Revisar | Contacto prioritario"
}
    `
    // Si no encuentras datos, usa tu mejor estimación conservadora o 0.

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const jsonStr = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    return JSON.parse(jsonStr)
  } catch (error) {
    if (
      error?.message?.includes('429') ||
      error?.message?.includes('Resource has been exhausted')
    ) {
      throw {
        code: 'QUOTA_EXCEEDED',
        message:
          'Se ha excedido la cuota gratuita de la IA. Por favor espera unos minutos e intenta nuevamente.',
      }
    }

    throw new Error(
      'No se pudo completar el análisis automáticamente. Intenta nuevamente.'
    )
  }
}

export default {
  discoverLeads,
  analyzeLead,
}
