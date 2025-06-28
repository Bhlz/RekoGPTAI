// api/chat.js
// No necesitas dotenv.config() aquí, Vercel inyecta las variables de entorno directamente.
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();

// Configura el cliente de OpenAI con tu clave API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Vercel inyectará esto de forma segura
});

// Middlewares
app.use(cors({
    origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '*', // Más seguro: permite solo tu dominio Vercel en prod
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Ruta para manejar las solicitudes de chat
app.post('/', async (req, res) => { // La ruta base para la función es '/'
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Mensaje no proporcionado.' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error('Error al comunicarse con OpenAI:', error);
        const errorMessage = error.message || 'Error desconocido al obtener respuesta de la IA.';
        console.error('Detalle del error:', errorMessage);

        res.status(500).json({ 
            error: 'Error al obtener respuesta de la IA.', 
            details: process.env.NODE_ENV === 'development' ? errorMessage : 'Un error ha ocurrido en el servidor.' 
        });
    }
});

// ¡IMPORTANTE! Exporta la aplicación Express para que Vercel pueda usarla.
module.exports = app;