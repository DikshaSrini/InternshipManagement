const Assignment = require("../models/Assignment");
const Intern = require("../models/Intern");
const Project = require("../models/Project");

// GET all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.json(assignments);
  } catch (err) {
    res.status(500).send("Error fetching assignments");
  }
};

// SAVE manual assignments (merge with existing)
exports.saveAssignments = async (req, res) => {
  const { manual } = req.body;

  if (!manual || typeof manual !== "object") {
    return res.status(400).send("Invalid assignments data");
  }

  try {
    for (const [projectId, interns] of Object.entries(manual)) {
      await Assignment.updateOne(
        { projectId },
        { $set: { manual: interns } },
        { upsert: true }
      );
    }
    res.status(200).send("Manual assignments saved successfully");
  } catch (err) {
    res.status(500).send("Error saving manual assignments");
  }
};

// SAVE auto assignments (merge with existing)
exports.saveAutoAssignments = async (req, res) => {
  const { auto } = req.body;

  if (!auto || typeof auto !== "object") {
    return res.status(400).send("Invalid auto assignments data");
  }

  try {
    for (const [projectId, interns] of Object.entries(auto)) {
      await Assignment.updateOne(
        { projectId },
        { $set: { auto: interns } },
        { upsert: true }
      );
    }
    res.status(200).send("Auto assignments saved successfully");
  } catch (err) {
    res.status(500).send("Error saving auto assignments");
  }
};

// Export assignments with intern/project names
exports.getAssignmentsForExport = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    const interns = await Intern.find({});
    const projects = await Project.find({});

    const internMap = new Map(interns.map(i => [String(i.id), i.name]));
    const projectMap = new Map(projects.map(p => [String(p.id), p.title]));

    const exportData = assignments.map(assignment => {
      const projectId = assignment.projectId;
      const projectName = projectMap.get(projectId) || "Unknown";

      const autoAssigned = (assignment.auto || []).map(i => ({
        id: i.id,
        name: internMap.get(String(i.id)) || "Unknown",
        match: i.match,
      }));

      const manualAssigned = (assignment.manual || []).map(i => {
        const internId = typeof i === "object" ? i.internId : i;
        return {
          id: internId,
          name: internMap.get(String(internId)) || "Unknown",
        };
      });

      return {
        projectId,
        projectName,
        autoAssigned,
        manualAssigned,
      };
    });

    res.json(exportData);
  } catch (err) {
    res.status(500).send("Error exporting assignments");
  }
};
