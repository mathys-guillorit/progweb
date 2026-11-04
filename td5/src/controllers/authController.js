import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export async function registerUser(body) {
    const { email, password } = body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: "This email is already in use." };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        return { success: true, message: "Utilisateur enregistré avec succès." };
    } catch (err) {
        return { success: false, message: "Error saving : " + err.message };
    }
}

export async function loginUser(body) {
    const { email, password } = body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "Incorrect email or password." };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Incorrect email or password." };
        }

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            secret, 
            { expiresIn: '24h' }
        );

        return { 
            success: true, 
            message: "Successful login.",
            token: token 
        };
    } catch (err) {
        return { success: false, message: "Error connecting : " + err.message };
    }
}