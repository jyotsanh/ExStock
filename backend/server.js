const app = require('./app');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



mongoose.connect('mongodb://localhost:27017/abc', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
