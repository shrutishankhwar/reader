const User = require('../model/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists*****
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password******
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user*****
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Create JWT token****
    const payload = {
      id: user._id,
    
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "Registration successful",
      token,
      user
    });
  } catch (err) {
   return res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token  ,user });
  } catch (err) {
   return res.status(500).json({ error: err.message });
  }
};

exports.getSingleUser = async (req, res) => {
    try {
        //*** fetch single user from database */
   const id = req.user.id;
        console.log("Fetching user with ID:", id);
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({ message: "cannot find user  with this id" });
        }
        return res.status(200).json({ user, message: "user found successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.updateUser = async (req, res) => {

    try {
        const id = req.params.id;
        console.log(id);
        const User = req.body;
        const data = await User.updateMany(
            { _id: id },
            User,
            { new: true }
        );

        console.log(data)
        if (!data) {
            return res.status(400).json({ message: "client not found" });
        }
        return res.status(200).json({ data: data, message: "get single client successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        console.log("Deleting user:", id);
        console.log(password);

        const data = await User.deleteOne(
            {
                _id: id,
                password
            }
        );
        console.log(data);
        if (!data) {
            return res.status(404).json({ message: "Client not found or password incorrect" });
        }

        return res.status(200).json({ message: "Deleted client successfully", data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

