const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const OTP = require('../models/otpSchema');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//For generating the webtoken
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

//@For initiate Registration
// POST /api/auth/sendOTP
const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Email is mandatory to register.');;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists, Login Please');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    } else {
        await sendEmail(email, otp);
    }

    res.status(200).json({ message: "OTP sent successfully" });

});

//@For creating the user after OTP verification
//POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
    // Now we ask for EVERYTHING, including the OTP they just got
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
        res.status(400);
        throw new Error('All fields are mandatory.');
    }

    // 1. Verify the OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
        res.status(400);
        throw new Error('Invalid or Expired OTP');
    }

    // 2. Hash Password
    const hashedPass = await bcrypt.hash(password, 10);

    // 3. FINALLY Create the User (Securely)
    const newUser = await User.create({
        name,
        email,
        password: hashedPass
    });

    // 4. Delete the used OTP (Cleanup)
    await OTP.deleteOne({ email });

    if (newUser) {
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser.id) // Don't forget to generate JWT!
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@For easy logging in the user
//POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // 2. Check for user
    const user = await User.findOne({ email });

    // 3. Check password (Compare plaintext vs hashed)
    if (user && (await bcrypt.compare(password, user.password))) {

        // SUCCESS! Send back their "Badge" (Token) + Info
        res.json({
            message: 'User login Successful',
            _id: user.id,
            name: user.name,
            email: user.email,
            mmr: user.mmr, // Send MMR so we can show it on the dashboard
            token: generateToken(user._id),
        });

    } else {
        // FAIL
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

//@GET  api/auth/aboutUser
const getinfo=asyncHandler(async (req, res) => {
  try {
    // 1. Get Token from Header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    
    if (!token) return res.status(401).json({ message: "No token provided" });

    // 2. Verify Token
    // Use the same fallback secret as your socket logic
    const secret = process.env.ACCESS_TOKEN_SECRET || "PulseIQSecretKey123";
    const decoded = jwt.verify(token, secret);

    // 3. Find User (Fresh from DB)
    const user = await User.findById(decoded.id).select('-password'); // Don't send password!
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Token" });
  }
});

const resetMatch=asyncHandler(async(req,res)=>{
    try {
        // This finds ALL users and sets their matchHistory to an empty array []
        await User.updateMany({}, { $set: { matchHistory: [] } });
        
        // Optional: Reset stats too if you want a fresh start
        // await User.updateMany({}, { $set: { matchHistory: [], wins: 0, gamesPlayed: 0, mmr: 1000 } });

        res.send("✅ All match history has been wiped!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});


const resetStat = asyncHandler(async(req, res) => {
    try {
        // FIX: Grab 'id' directly from params (matching your route '/resetStat/:id')
        const userId = req.params.id; 

        // Debugging line (Optional: checks if ID is received)
        console.log("Resetting stats for ID:", userId); 

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { 
                $set: { 
                    mmr: 1000,          // Reset to default
                    wins: 0, 
                    gamesPlayed: 0, 
                    matchHistory: [] 
                } 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "✅ Stats reset successfully!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = { sendOTP, registerUser, loginUser,getinfo,resetMatch,resetStat };