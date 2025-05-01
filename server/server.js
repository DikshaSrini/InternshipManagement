const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/intern-management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const internRoutes = require('./routes/internRoutes');
const projectRoutes = require('./routes/projectRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes'); // ✅ Added

app.use(cors());
app.use(express.json());

app.use('/api/interns', internRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes); // ✅ Added

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
