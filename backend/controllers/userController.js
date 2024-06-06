const User = require("../models/user");
const bcrypt = require("bcrypt");
const authMiddleware = require("../auth/authMiddleware");

const registerUser = async (req, res) => {

    try {
        const { name, email, contactNumber, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            contactNumber,
            password: hashedPassword
        })

        const saved = await newUser.save();

        if (saved) {
            const token = authMiddleware.generateToken(newUser);
            return res.status(201).json({ message: "User registered successfully", token });
        }

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" + err });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Generate a JWT token and include user details in the response
            const token = authMiddleware.generateToken(user);
            return res.status(200).json({ message: "Login successful", token, user });
        }

        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateUser = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            console.log("not  averified user")
            return res.status(404).json({ message: "user not found" });
        }

        const { name, email, contactNumber, password } = req.body;

        const temp = {};

        if (name) temp.name = name;
        if (email) temp.email = email;
        if (contactNumber) temp.contactNumber = contactNumber;
        if (password) temp.password = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(verifiedUser._id, temp, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        console.log("IN DELETE USER FUNC")

        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            console.log("not  averified user")
            return res.status(404).json({ message: "user not found" });
        }
        console.log("VEIRFIED USER ID,", verifiedUser._id)

        const deletedUser = await User.findByIdAndDelete(verifiedUser._id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const viewUsers = async (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

    if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const verifiedUser = await User.findById(user.userId);

    if (!verifiedUser) {
        console.log("not  averified user")
        return res.status(404).json({ message: "user not found" });
    }

    const users = await User.find();

    if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
}




module.exports = { registerUser, login, deleteUser, updateUser, viewUsers };

