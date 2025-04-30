const Project = require("../models/Project"); // Import Project model

// ✅ GET all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();  // Fetch all projects from MongoDB
    res.json(projects);  // Send the projects as a response
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send("Server error");
  }
};

// ✅ POST: add a new project
exports.addProject = async (req, res) => {
  const newProject = req.body;

  if (!newProject || !newProject.title || !newProject.description) {
    return res.status(400).send("Missing required project information");
  }

  try {
    const createdProject = new Project(newProject);  // Create a new Project instance
    await createdProject.save();  // Save to the database
    res.status(201).json(createdProject);  // Respond with the created project
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).send("Error adding project");
  }
};

// ✅ POST: update project information (if needed)
exports.updateProject = async (req, res) => {
  const { projectId, updatedData } = req.body;

  if (!projectId || !updatedData) {
    return res.status(400).send("Invalid input");
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updatedData,
      { new: true }  // Return the updated project
    );
    if (!updatedProject) return res.status(404).send("Project not found");

    res.json(updatedProject);  // Respond with the updated project
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send("Error updating project");
  }
};
