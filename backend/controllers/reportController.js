const moment = require("moment");
const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// Get Upcoming Deadlines summary
const getUpcomingDeadlines = async (req, res) => {
  try {
    const baseFilter = {};
    if (req.user && req.user.role === "member") {
      baseFilter.assignedTo = req.user._id;
    }

    const today = moment().startOf("day");
    const endOfToday = moment().endOf("day");
    const endOfWeek = moment().endOf("week");
    const endOfNextWeek = moment().add(1, "weeks").endOf("week");

    // Apply baseFilter to each count query so counts respect the user (if member).
    const todayCount = await Task.countDocuments({
      ...baseFilter,
      dueDate: { $gte: today.toDate(), $lte: endOfToday.toDate() },
    });

    const thisWeekCount = await Task.countDocuments({
      ...baseFilter,
      dueDate: { $gt: endOfToday.toDate(), $lte: endOfWeek.toDate() },
    });

    const nextWeekCount = await Task.countDocuments({
      ...baseFilter,
      dueDate: { $gt: endOfWeek.toDate(), $lte: endOfNextWeek.toDate() },
    });

    const laterCount = await Task.countDocuments({
      ...baseFilter,
      dueDate: { $gt: endOfNextWeek.toDate() },
    });

    res.json({
      today: todayCount,
      thisWeek: thisWeekCount,
      nextWeek: nextWeekCount,
      later: laterCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming deadlines", error: error.message });
  }
};


//Export all tasks as Excel/PDF
//This function retrieves all tasks from the database, formats them into an Excel sheet, and sends it as a downloadable file.
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ");
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="tasks_report_.xlsx"');
    
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }catch(error){
    res.status(500).json({ message: "Error exporting tasks", error: error.message });
  }
};

const exportUsersReport = async(req,res) => {
  try {
    const users = await User.find().select("name email").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email");

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });


    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="users_report.xlsx"');
    
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }catch(error){
    res.status(500).json({ message: "Error exporting users report", error: error.message });

  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
  getUpcomingDeadlines,
};