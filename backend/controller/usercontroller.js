import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyEmail from "../emailVerify/verifyEmail.js";
import SessionModel from "../models/sessionModel.js";
import sendOTPmail from "../emailVerify/sendOTPmail.js";
import cloudinary from "../utilis/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
                firstname,
                lastname,
                email,
                password: hashedPassword
            });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('token',token)
        verifyEmail(token, email);
        newUser.token = token;
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(400).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    success: false,
                    message: 'Token has expired'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Token Verification failed'
            });
        }
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        user.token = null;
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const reverify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Verification email sent again successfully',
            token: user.token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const exisitingUser = await UserModel.findOne({ email });
        if (!exisitingUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, exisitingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        if (!exisitingUser.isVerified) {
            return res.status(400).json({
                success: false,
                message: "verify your account to login"
            });
        }

        //geenerate jwt token
        const accessToken = jwt.sign({ id: exisitingUser._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: exisitingUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        exisitingUser.isLoggedIn = true;
        await exisitingUser.save();

        // check for existing session and delete it
        const existingSession = await SessionModel.findOne({ userId: exisitingUser._id });
        if (existingSession) {
            await SessionModel.deleteOne({ userId: exisitingUser._id });
        }
        // create a new session
        await SessionModel.create({ userId: exisitingUser._id });
        return res.status(200).json({
            success: true,
            message: `Welcome back ${exisitingUser.firstname}`,
            user: exisitingUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.id;
        await SessionModel.deleteMany({ userId: userId });
        await UserModel.findByIdAndUpdate(userId, { isLoggedIn: false });
        return res.status(200).json({
            success: true,
            message: "User Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        user.otp = otp;
        user.otpExpiry = otpExpiry;

        await user.save();
        await sendOTPmail(otp, email);

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "otp is not generate or already verified"
            });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const allUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json({
            success: true,
            message:"all users",
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await UserModel.findById(userId).select('-password -otp -otpExpiry -token');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user; //from isAuthenticated middleware
        const { firstname, lastname, address, city, zipcode, phoneNo, role } = req.body;

        if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not allow to update this profile"
            });
        }

        let user = await UserModel.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        //if new file is uploaded

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }


            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'profiles' },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                )
                stream.end(req.file.buffer);
            })

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipcode = zipcode || user.zipcode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}