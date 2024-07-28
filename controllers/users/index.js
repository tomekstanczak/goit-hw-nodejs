const { User, signupSchema } = require("../../models/users.js");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidV4 } = require("uuid");
const sendVerificationEmail = require("../../config/email.js");

const signup = async (req, res, next) => {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { password, email } = req.body;

  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const avatar = gravatar.url(email, { s: "250", r: "pg", d: "404" });
    const newUser = new User({ email });
    newUser.avatarURL = avatar;
    newUser.verificationToken = uuidV4();
    await newUser.setPassword(password);
    await newUser.save();

    const code = newUser.verificationToken;

    const html = `<h1>Welcome</h1><a href="http://localhost:3000/api/users/verify/${code}">Click on the message to finish the verification</a>`;

    await sendVerificationEmail(email, html);

    return res.status(201).json({ message: "Created" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.verify === false) {
    return res.status(401).json({ message: "User is not verified" });
  }
  const isPasswordIsValidate = await user.validPassword(password);
  if (isPasswordIsValidate) {
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "30d" });

    user.token = token;
    await user.save();

    res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Email or password is wrong." });
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;

    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const user = req.user;

    const email = user.email;
    const subscription = user.subscription;

    res.status(200).json({ email, subscription });
  } catch (err) {
    next(err);
  }
};

const avatarUpdate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const storeImageDir = path.join(process.cwd(), "public/avatars");

    const { path: tempPath } = req.file;

    console.log(`Temp Path: ${tempPath}`);
    console.log(`Store Image Dir: ${storeImageDir}`);

    const extension = path.extname(tempPath);
    const fileName = `${uuidV4()}${extension}`;
    const filePath = path.join(storeImageDir, fileName);

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(filePath);
    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${fileName}`;

    if (req.user.avatarURL) {
      const oldAvatarPath = path.join(
        process.cwd(),
        "public",
        req.user.avatarURL
      );
      try {
        await fs.unlink(oldAvatarPath);
      } catch (err) {
        console.error(`Failed to delete old avatar: ${oldAvatarPath}`, err);
      }
    }

    req.user.avatarURL = avatarURL;
    await req.user.save();

    res.status(200).json({ avatarURL });
  } catch (err) {
    next(err);
  }
};

const userVerification = async (req, res, next) => {
  try {
    const lookingVToken = req.params.verificationToken;
    const user = await User.findOne({ verificationToken: lookingVToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  avatarUpdate,
  userVerification,
};
