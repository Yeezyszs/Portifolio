import 'dotenv/config';
import { createApp } from './app.js';

const PORT = process.env.PORT || 3333;

const app = createApp();
app.listen(PORT, () => {
  console.log(`🚀 DevFolio API rodando em http://localhost:${PORT}`);
});
