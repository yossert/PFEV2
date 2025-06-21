const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express(); // ✅ Ceci doit venir avant tous les `app.use(...)`

app.use(cors());
app.use(express.json());

// Routes principales
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/taches', require('./routes/tacheRoutes'));
app.use('/api/notes', require('./routes/noteRoutes')); // ✅ Ici c’est OK maintenant
app.use('/api/stats', require('./routes/stats'));
app.use('/api/test', require('./routes/resetPassword'));
app.use('/public', express.static('public'));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
