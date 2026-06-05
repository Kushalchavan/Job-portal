import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppError } from "../../utils/AppError";
import {
  createPasswordResetToken,
  createUser,
  deleteAllRefreshTokensByUserId,
  deletePasswordResetToken,
  deletePasswordResetTokensByUserId,
  deleteRefreshToken,
  findRefreshToken,
  findUserByEmail,
  findUserById,
  findPasswordResetToken,
  updatePassword,
  createEmailVerificationToken,
  deleteEmailVerificationTokensByUserId,
  deleteEmailVerificationToken,
  verifyUserEmail,
  findEmailVerificationToken,
} from "./auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { createRefreshToken } from "./auth.repository";
import { emailQueue } from "../../queues/email.queue";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "USER" | "RECRUITER" | "ADMIN",
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User Already Exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await deleteEmailVerificationTokensByUserId(user.id);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await createEmailVerificationToken(
    hashedVerificationToken,
    user.id,
    verificationTokenExpiresAt,
  );

  const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

  await emailQueue.add("SEND_EMAIL", {
    to: user.email,
    subject: "Verify Your Email",
    html: `
        <h2>Verify Your Email</h2>

        <p>
          Click the link below to verify your account:
        </p>

        <a href="${verificationUrl}">
          Verify Email
        </a>

        <p>
          This link expires in 24 hours.
        </p>
      `,
  });

  return {
    message: "Registration successful. Please verify your email.",
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Email does not exist", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  if (!user?.isActive) {
    throw new AppError("Your account has been blocked", 403);
  }

  const matchUser = await bcrypt.compare(password, user.password);

  if (!matchUser) {
    throw new AppError("Invalid Credentials", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await createRefreshToken(refreshToken, user.id, expiresAt);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
};

export const getCurrentUser = async (userId: number) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const savedToken = await findRefreshToken(refreshToken);

    if (!savedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (savedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return {
      accessToken,
    };
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }
};

export const logoutUser = async (refreshToken: string) => {
  const existingToken = await findRefreshToken(refreshToken);

  if (!existingToken) {
    throw new AppError("Refresh token not found", 404);
  }

  await deleteRefreshToken(refreshToken);

  return {
    message: "Logged out successfully",
  };
};

export const logoutAllDevices = async (userId: number) => {
  await deleteAllRefreshTokensByUserId(userId);

  return {
    message: "Logged out from all devices",
  };
};

export const forgotPassword = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  await deletePasswordResetTokensByUserId(user.id);

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await createPasswordResetToken(hashedToken, user.id, expiresAt);

  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

  await emailQueue.add("SEND_EMAIL", {
    to: user.email,
    subject: "Reset Your Password",
    html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
  });

  return {
    message:
      "If an account exists with that email, a reset link has been sent.",
  };
};

export const resetPassword = async (token: string, password: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetToken = await findPasswordResetToken(hashedToken);

  if (!resetToken) {
    throw new AppError("Invalid reset token", 400);
  }

  if (resetToken.expiresAt < new Date()) {
    await deletePasswordResetToken(resetToken.id);

    throw new AppError("Reset token has expired", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updatePassword(resetToken.userId, hashedPassword);
  await deletePasswordResetToken(resetToken.id);
  await deleteAllRefreshTokensByUserId(resetToken.userId);

  return {
    message: "Password reset successfully",
  };
};

export const verifyEmail = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const verificationToken = await findEmailVerificationToken(hashedToken);

  if (!verificationToken) {
    throw new AppError("Invalid verification token", 400);
  }

  if (verificationToken.expiresAt < new Date()) {
    await deleteEmailVerificationToken(verificationToken.id);

    throw new AppError("Verification token expired", 400);
  }

  await verifyUserEmail(verificationToken.userId);

  await deleteEmailVerificationToken(verificationToken.id);

  return {
    message: "Email verified successfully",
  };
};

export const resendVerificationEmail = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  if (user.emailVerified) {
    throw new AppError("Email already verified", 400);
  }

  await deleteEmailVerificationTokensByUserId(user.id);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await createEmailVerificationToken(
    hashedVerificationToken,
    user.id,
    verificationTokenExpiresAt,
  );

  const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

  await emailQueue.add("SEND_EMAIL", {
    to: user.email,
    subject: "Verify Your Email",
    html: `
          <h2>Verify Your Email</h2>

          <p>
            Click below to verify your account:
          </p>

          <a href="${verificationUrl}">
            Verify Email
          </a>
        `,
  });

  return {
    message: "Verification email sent",
  };
};
