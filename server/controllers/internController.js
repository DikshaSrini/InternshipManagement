const Intern = require("../models/Intern");

// ✅ GET all interns
exports.getInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (err) {
    console.error('Error fetching interns:', err);
    res.status(500).send("Server error");
  }
};

// ✅ POST: update intern preferences
exports.updatePreferences = async (req, res) => {
  const { internId, preferences } = req.body;

  if (!internId || !Array.isArray(preferences)) {
    return res.status(400).send("Invalid input");
  }

  try {
    const updatedIntern = await Intern.findByIdAndUpdate(
      internId,
      { preferences },
      { new: true }
    );
    if (!updatedIntern) return res.status(404).send("Intern not found");

    res.send("Preferences updated");
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).send("Error updating preferences");
  }
};

// ✅ POST: add a new intern
exports.addIntern = async (req, res) => {
  const newIntern = req.body;

  if (!newIntern || !newIntern.name || !newIntern.position || !newIntern.institution) {
    return res.status(400).send("Missing required intern information");
  }

  try {
    const createdIntern = new Intern(newIntern);
    await createdIntern.save();
    res.status(201).json(createdIntern);
  } catch (err) {
    console.error('Error adding intern:', err);
    res.status(500).send("Error adding intern");
  }
};

// ✅ DELETE: Remove an intern by ID
exports.deleteIntern = async (req, res) => {
  const { internId } = req.params;  // Get internId from the URL parameter

  try {
    const deletedIntern = await Intern.findByIdAndDelete(internId);
    if (!deletedIntern) return res.status(404).send("Intern not found");

    res.send("Intern deleted successfully");
  } catch (err) {
    console.error('Error deleting intern:', err);
    res.status(500).send("Error deleting intern");
  }
};

// ✅ PUT: Update intern details
exports.updateIntern = async (req, res) => {
  const { internId } = req.params;  // Get internId from the URL parameter
  const updateData = req.body;  // Get the updated intern data from the request body

  try {
    const updatedIntern = await Intern.findByIdAndUpdate(internId, updateData, { new: true });
    if (!updatedIntern) return res.status(404).send("Intern not found");

    res.json(updatedIntern);  // Return the updated intern data
  } catch (err) {
    console.error('Error updating intern:', err);
    res.status(500).send("Error updating intern");
  }
};

