import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and resume is required", 400));
  }
  const { avatar, resume } = req.files;
  const cloudinaryResponseAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "avatars" }
  );
  if (!cloudinaryResponseAvatar || !cloudinaryResponseAvatar.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseAvatar.error || "Unknown cloudinary error"
    );
  }
  const cloudinaryResponseResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "resume" }
  );
  if (!cloudinaryResponseResume || !cloudinaryResponseResume.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseResume.error || "Unknown cloudinary error"
    );
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioUrl,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedinUrl,
    twitterUrl,
  } = req.body;

  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    avatar: {
      public_id: cloudinaryResponseAvatar.public_id,
      url: cloudinaryResponseAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseResume.public_id,
      url: cloudinaryResponseResume.secure_url,
    },
    portfolioUrl,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedinUrl,
    twitterUrl,
  });
  generateToken(user, "User registered successfully", 201, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({
    email,
  }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  generateToken(user, "User logged in successfully", 200, res);
});

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfolioUrl: req.body.portfolioUrl,
    githubUrl: req.body.githubUrl,
    instagramUrl: req.body.instagramUrl,
    facebookUrl: req.body.facebookUrl,
    linkedinUrl: req.body.linkedinUrl,
    twitterUrl: req.body.twitterUrl,
  };

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "avatars",
      }
    );
    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user.id);
    const resumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(resumeId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "resume",
      }
    );
    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile Updated!",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current password", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = "67fdf1b5565673aa1a300d24";
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPassword = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetPassword}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Personal Dashboard Portfolio  Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password does not match", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  generateToken(user, "Password reset successfully", 200, res);
});
