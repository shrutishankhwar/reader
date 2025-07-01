const express = require('express');
const router = express.Router();

const {register,
    login,
    // getSingleUser,
    updateUser,
    deleteSingleUser} = require('../controllers/authController');

router.post("/register",register);

router.get("/login",login);

// router.get("/getSingleUser",getSingleUser);

router.put("/updateUser/:id",updateUser);

router.delete("/deleteSingleUser/:id",deleteSingleUser);

module.exports = router;
