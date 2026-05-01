const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

// GET /api/dashboard — task stats for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    // Build the same filter as tasks GET
    const adminProjects = await Project.find({ admin: req.user.id }).select("_id");
    const adminProjectIds = adminProjects.map((p) => p._id);

    const filter = {
      $or: [
        { project: { $in: adminProjectIds } },
        { assignedTo: req.user.id },
      ],
    };

    const tasks = await Task.find(filter);

    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;

    res.json({ total, todo, inProgress, done });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
