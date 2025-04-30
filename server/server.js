// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// const mockDataPath = path.join(__dirname, 'mockData.json');
// const projectsPath = path.join(__dirname, 'mockProjects.json');
// const assignmentsPath = path.join(__dirname, 'assignments.json');

// // GET all interns
// app.get('/interns', (req, res) => {
//   fs.readFile(mockDataPath, 'utf8', (err, data) => {
//     if (err) return res.status(500).send('Error reading intern data');
//     res.json(JSON.parse(data));
//   });
// });

// // POST to update preferences
// app.post('/updatePreferences', (req, res) => {
//   const { internId, preferences } = req.body;

//   if (!internId || !Array.isArray(preferences)) {
//     return res.status(400).send('Missing or invalid internId/preferences');
//   }

//   fs.readFile(mockDataPath, 'utf8', (err, data) => {
//     if (err) return res.status(500).send('Error reading intern data');

//     let interns = JSON.parse(data);
//     const internIndex = interns.findIndex((i) => i.id === internId);

//     if (internIndex === -1) {
//       return res.status(404).send('Intern not found');
//     }

//     interns[internIndex].preferences = preferences;

//     fs.writeFile(mockDataPath, JSON.stringify(interns, null, 2), 'utf8', (err) => {
//       if (err) return res.status(500).send('Error saving preferences');
//       res.status(200).send('Preferences updated successfully');
//     });
//   });
// });

// //GET all projects
// app.get('/projects', (req, res) => {
//   fs.readFile(projectsPath, 'utf8', (err, data) => {
//     if (err) return res.status(500).send('Error reading project data');
//     res.json(JSON.parse(data));
//   });
// });

// // (Optional) GET current assignments (for viewing or editing)
// app.get('/assignments', (req, res) => {
//   fs.readFile(assignmentsPath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).send('Error reading assignment data');
//     }

//     // Return the assignments if available, otherwise return an empty object
//     res.json(JSON.parse(data) || { manual: {}, auto: {} });
//   });
// });

// // POST to save assignments
// app.post('/assignments', (req, res) => {
//   const { manual } = req.body; // We only care about manual assignments

//   if (!manual || typeof manual !== 'object') {
//     return res.status(400).send('Invalid assignments data');
//   }

//   // Read the current assignments file
//   fs.readFile(assignmentsPath, 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).send('Error reading assignment data');
//     }

//     let assignments = JSON.parse(data) || { manual: {}, auto: {} };

//     // Update the manual assignments
//     assignments.manual = { ...assignments.manual, ...manual };

//     // Write the updated assignments back to the file
//     fs.writeFile(assignmentsPath, JSON.stringify(assignments, null, 2), 'utf8', (err) => {
//       if (err) return res.status(500).send('Error saving assignments');
//       res.status(200).send('Assignments saved successfully');
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

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

app.use(cors());
app.use(express.json());

app.use('/api/interns', internRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assignments', assignmentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
