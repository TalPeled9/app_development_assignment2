import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel";

// Helper function to generate tokens
const generateTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error("JWT secrets not configured");
  }

  const accessToken = jwt.sign({ _id: userId }, jwtSecret, {
    expiresIn: "5s", // 5 seconds for testing
  });

  const refreshToken = jwt.sign({ _id: userId }, jwtRefreshSecret, {
    expiresIn: "7d", // 7 days
  });

  return { accessToken, refreshToken };
};

// Register endpoint
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, profilePicture } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || undefined,
      refreshTokens: [],
    });

    const savedUser = await user.save();

    // Generate tokens with actual user ID
    const { accessToken, refreshToken } = generateTokens(savedUser._id.toString());

    // Update user with refresh token
    savedUser.refreshTokens = [refreshToken];
    await savedUser.save();

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login endpoint
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Add new refresh token to user's tokens array
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Refresh token endpoint
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) {
      res.status(500).json({ message: "JWT refresh secret not configured" });
      return;
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { _id: string };
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired refresh token", error });
      return;
    }

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Check if refresh token exists in user's tokens array
    const tokenIndex = user.refreshTokens.indexOf(refreshToken);

    if (tokenIndex === -1) {
      // Token not found - possibly already used (security breach)
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate new tokens
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(user._id.toString());

    // Remove old refresh token and add new one (token rotation)
    user.refreshTokens.splice(tokenIndex, 1);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error });
  }
};
