const express = require("express");
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");

const router = express.Router();

// POST /api/projects — create project (creator becomes admin)
router.post("/", auth, async (req, res) => {
  try {
    const { name, memberEmails } = req.body;

    // Resolve member emails to user IDs
    let members = [];
    if (memberEmails && memberEmails.length > 0) {
      const users = await User.find({ email: { $in: memberEmails } }).select("_id");
      members = users.map((u) => u._id);
    }

    // Always include the creator
    if (!members.some((m) => m.toString() === req.user.id)) {
      members.push(req.user.id);
    }

    const project = await Project.create({
      name,
      admin: req.user.id,
      members,
    });

    // Set creator role to admin
    await User.findByIdAndUpdate(req.user.id, { role: "admin" });

    const populated = await Project.findById(project._id)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects — get projects for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }],
    })
      .populate("admin", "name email")
      .populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
