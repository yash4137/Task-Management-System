const express = require("express");
const {adminOnly,protect} = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();


//user management routes
router.get("/", protect, adminOnly, getUsers);   //one error in api get All Users not show all users only member or admin
router.get("/:id", protect, getUserById);

module.exports = router;