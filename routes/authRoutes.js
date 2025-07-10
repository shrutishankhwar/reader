const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const {register,
    login,
    getSingleUser,
    updateUser,
    deleteSingleUser} = require('../controllers/authController');

router.post("/register",register);

router.post("/login",login);

router.get("/getSingleUser", verifyToken ,getSingleUser);

router.put("/updateUser/:id",updateUser);

router.delete("/deleteSingleUser/:id",deleteSingleUser);


module.exports = router;
