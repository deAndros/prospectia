# ProspectIA

**Plataforma inteligente de descubrimiento y priorización de leads impulsada por IA**

ProspectIA es una aplicación full-stack MERN que revoluciona el proceso de prospección comercial mediante inteligencia artificial. Utiliza Google Gemini con búsqueda en tiempo real para descubrir, enriquecer y priorizar automáticamente partners estratégicos potenciales.

---

## Características Principales

### **Descubrimiento Inteligente de Leads**

- **Búsqueda impulsada por IA**: Utiliza Google Gemini 2.0 Flash con Google Search Grounding para encontrar prospectos relevantes en tiempo real
- **Filtros avanzados**: Búsqueda por país, industria/rubro y cantidad de resultados
- **Extracción automática de datos**:
  - Información de contacto (email, teléfono)
  - Sitio web oficial
  - Perfiles de redes sociales (LinkedIn, Instagram, Facebook, Twitter)
  - Conteo de seguidores en cada plataforma
  - Señales de interés (e-learning, tecnología, capacitación)

### **Sistema de Scoring On-Demand**

- **Análisis de calidad**: Calcula un score de 0-100 basado en 6 criterios clave
- **Clasificación automática**: Segmenta leads en buckets A, B, C o Nurture
- **Criterios de evaluación**:
  - **Audiencia** (25 pts): Tamaño total de seguidores en redes sociales
  - **Engagement** (20 pts): Nivel de interacción con la audiencia
  - **Verticales Relevantes** (20 pts): Coincidencia con sectores objetivo
  - **Interés en E-Learning** (15 pts): Presencia de catálogos o páginas educativas
  - **Señales de IA** (15 pts): Indicadores de adopción tecnológica
  - **Información de Contacto** (5 pts): Disponibilidad de email y teléfono

### **Gestión de Prospectos**

- **Vista dual**: Modo grid (tarjetas) y modo lista
- **Filtros dinámicos**: Por nombre, país, rubro
- **Estados personalizables**: New, Contacted, Interested, Pending Contact
- **Edición inline**: Actualiza información directamente desde el modal de detalles
- **Eliminación segura**: Soft delete para mantener historial

### **Interfaz Premium**

- **Diseño moderno**: Dark mode con gradientes sutiles y glassmorphism
- **Animaciones fluidas**: Transiciones suaves con Framer Motion
- **Responsive**: Optimizado para desktop y mobile
- **UX intuitiva**: Tooltips, badges, y feedback visual en tiempo real

---

## Stack Tecnológico

### **Frontend**

- **React 18** + **Vite** - Framework y build tool
- **TailwindCSS** - Styling utility-first
- **Framer Motion** - Animaciones y transiciones
- **Axios** - Cliente HTTP
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía moderna

### **Backend**

- **Node.js** + **Express** - Runtime y framework web
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **Google Gemini API** - Inteligencia artificial generativa
- **dotenv** - Gestión de variables de entorno
- **CORS** - Seguridad cross-origin

### **Arquitectura**

- **Patrón MVC**: Separación clara de responsabilidades
- **API RESTful**: Endpoints semánticos y predecibles
- **React Portal**: Renderizado de modales fuera del árbol DOM
- **Programmatic Filtering**: Validación de datos en múltiples capas

---

## Instalación y Configuración

### **Prerrequisitos**

- Node.js 18+ y npm
- MongoDB 6+ (local o Atlas)
- API Key de Google Gemini

### **1. Clonar el repositorio**

```bash
git clone https://github.com/TU_USUARIO/prospect-compass.git
cd prospect-compass
```

### **2. Configurar el Backend**

```bash
cd server
npm install

# Crear archivo .env
echo "MONGO_URI=mongodb://localhost:27017/prospect-compass" > .env
echo "GEMINI_API_KEY=tu_api_key_aqui" >> .env
echo "PORT=5000" >> .env

npm run dev
```

### **3. Configurar el Frontend**

```bash
cd ../client
npm install
npm run dev
```

### **4. Acceder a la aplicación**

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📁 Estructura del Proyecto

```
prospect-compass/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── LeadDetailModal.jsx
│   │   │   ├── CountrySelector.jsx
│   │   │   └── NicheSelector.jsx
│   │   ├── pages/         # Vistas principales
│   │   │   ├── Discovery.jsx
│   │   │   └── Leads.jsx
│   │   └── App.jsx
│   └── package.json
│
└── server/                # Backend Node.js
    ├── src/
    │   ├── models/        # Esquemas Mongoose
    │   │   └── Lead.js
    │   ├── routes/        # Endpoints API
    │   │   └── api.js
    │   ├── services/      # Lógica de negocio
    │   │   └── geminiService.js
    │   └── index.js       # Punto de entrada
    └── package.json
```

---

## 🔑 Variables de Entorno

### **Backend (.env)**

```env
MONGO_URI=mongodb://localhost:27017/prospect-compass
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=5000
```

### **Obtener API Key de Gemini**

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea un nuevo proyecto
3. Genera una API key
4. Cópiala en tu archivo `.env`

---

## 📡 API Endpoints

### **Leads**

- `GET /api/leads` - Obtener todos los leads guardados
- `POST /api/leads/discover` - Descubrir nuevos leads con IA
- `POST /api/leads/save` - Guardar leads seleccionados
- `PUT /api/leads/:id` - Actualizar un lead
- `DELETE /api/leads/:id` - Eliminar un lead (soft delete)
- `POST /api/leads/:id/analyze` - Calcular score de prioridad

---

## 🎯 Casos de Uso

### **Ejemplo 1: Descubrir Partners en Argentina**

1. Ir a "Descubrimiento de Prospectos"
2. Seleccionar país: **Argentina**
3. Seleccionar rubro: **Capacitación Corporativa**
4. Cantidad: **10**
5. Hacer clic en "Buscar Prospectos"
6. Revisar resultados con datos de redes sociales
7. Seleccionar los más relevantes
8. Guardar en "Mis Prospectos"

### **Ejemplo 2: Priorizar un Lead**

1. Ir a "Mis Prospectos"
2. Hacer clic en el botón naranja (calculadora) de un lead
3. Esperar el análisis de IA (10-15 segundos)
4. Ver el score y bucket asignado
5. Hacer clic en la tarjeta para ver el desglose completo

---

## 🧪 Características Técnicas Destacadas

### **Gemini Integration**

- **Google Search Grounding**: Búsqueda en tiempo real sin alucinaciones
- **Structured Output**: JSON parsing robusto con validación
- **Error Handling**: Retry logic y logging detallado
- **Rate Limiting**: Manejo de cuotas y límites de API

### **Data Quality**

- **Programmatic Filtering**: Descarta leads sin URL o redes sociales
- **Defensive Programming**: Validación en frontend y backend
- **Sanitization**: Normalización de datos antes de guardar

### **UX Optimizations**

- **React Portal**: Modales sin conflictos de z-index
- **Optimistic Updates**: UI actualizada antes de respuesta del servidor
- **Loading States**: Feedback visual en todas las operaciones asíncronas
- **Error Boundaries**: Manejo graceful de errores

---

## 🔒 Seguridad

- ✅ Variables de entorno protegidas con `.gitignore`
- ✅ CORS configurado para dominios específicos
- ✅ Validación de datos en backend
- ✅ Sanitización de inputs
- ✅ Soft delete para auditoría

---

## 🐛 Troubleshooting

### **Error: "Gemini API 404"**

- Verifica que estés usando `gemini-2.0-flash-exp` (no `gemini-1.5-flash`)
- Confirma que tu API key sea válida

### **Error: "MongoDB connection failed"**

- Asegúrate de que MongoDB esté corriendo: `mongod`
- Verifica la URI en `.env`

### **Frontend no carga**

- Revisa que el backend esté corriendo en puerto 5000
- Verifica la configuración de proxy en `vite.config.js`

---

## 🚧 Roadmap

- [ ] Integración con CRM (HubSpot, Salesforce)
- [ ] Exportación a CSV/Excel
- [ ] Notificaciones por email
- [ ] Dashboard de analytics
- [ ] Multi-idioma (EN, PT)
- [ ] Autenticación de usuarios

---

## 📄 Licencia

Este proyecto es privado y de uso interno. Todos los derechos reservados.

---

## 👨‍💻 Autor

Desarrollado con ❤️ usando Google Gemini AI

---

## 🙏 Agradecimientos

- **Google Gemini** por la potencia de IA generativa
- **Tailwind Labs** por el framework de CSS
- **Framer** por las animaciones fluidas
- **MongoDB** por la flexibilidad de datos
