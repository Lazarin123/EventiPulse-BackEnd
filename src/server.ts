import express from 'express';
import 'dotenv/config';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(express.json());

app.use('/api', webhookRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 EventPulse API rodando na porta ${PORT}`);
});
