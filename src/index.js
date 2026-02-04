import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});