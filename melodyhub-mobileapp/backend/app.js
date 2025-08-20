const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Khai báo router
app.use('/api/events', require('./routes/events'));

app.use('/api/venue', require('./routes/venue'));

app.use('/api/review', require('./routes/review'));

app.use('/api/artist', require('./routes/artist'));

app.use('/api/category', require('./routes/category'));

app.use('/api/booking', require('./routes/booking'));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/profile', require('./routes/profile'));

app.use('/api/admin', require('./routes/admin'));



// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server accessible at: http://192.168.200.35:${PORT}`);
});
