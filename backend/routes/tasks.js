const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const Project = require("../models/Project");

const router = express.Router();

// POST /api/tasks — create task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, project, assignedTo } = req.body;

    // Verify project exists and user has access
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    const isAdmin = proj.admin.toString() === req.user.id;
    if (!isAdmin) return res.status(403).json({ message: "Only project admin can create tasks" });

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      project,
      assignedTo,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks — get tasks (admin sees all project tasks, member sees only assigned)
router.get("/", auth, async (req, res) => {
  try {
    const { project } = req.query;
    let filter = {};

    if (project) {
      const proj = await Project.findById(project);
      if (!proj) return res.status(404).json({ message: "Project not found" });

      const isAdmin = proj.admin.toString() === req.user.id;

      if (isAdmin) {
        filter = { project };
      } else {
        filter = { project, assignedTo: req.user.id };
      }
    } else {
      // No project filter — get all tasks user can see
      const adminProjects = await Project.find({ admin: req.user.id }).select("_id");
      const adminProjectIds = adminProjects.map((p) => p._id);

      filter = {
        $or: [
          { project: { $in: adminProjectIds } },
          { assignedTo: req.user.id },
        ],
      };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id — update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const proj = await Project.findById(task.project);
    const isAdmin = proj.admin.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Members can only update status
    const updates = isAdmin
      ? req.body
      : { status: req.body.status };

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
