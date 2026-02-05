import express from 'express';
import { matchRouter } from './routes/matches.js';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Server is running!' });
});

app.use('/matches', matchRouter);


app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
