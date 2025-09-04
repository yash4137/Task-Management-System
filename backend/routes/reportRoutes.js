const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport, getUpcomingDeadlines } = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks",protect, adminOnly, exportTasksReport);    //Export all tasks as Excel/PDF
router.get("/export/users",protect, adminOnly, exportUsersReport);    //Export user-task report

router.get("/upcoming-deadlines", protect, adminOnly, getUpcomingDeadlines);


module.exports = router;