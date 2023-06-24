const { users } = require("../models");
const crypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

//REGISTER
exports.register = async (req, res) => {
  //input form
  const { username, fullname, email, password } = req.body;

  // Check for empty or null values
  if (!username || !fullname || !email || !password) {
    return res.status(400).json({ message: "Please fill in all the fields" });
  }

  try {
    // Check if email already exists
    // const existingEmail = await users.findOne({ where: { email } });
    // if (existingEmail) {
    //   return res.status(400).json({ message: "Email is already registered" });
    // }

    // Check if username already exists
    // const existingUsername = await users.findOne({ where: { username } });
    // if (existingUsername) {
    //   return res
    //     .status(400)
    //     .json({ message: "Username is already registered" });
    // }

    // password convert to hashed
    const hashedPassword = crypt.hashSync(password, 8);

    //store to db
    const createUser = await users.create({
      username: username,
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Registered Successfully",
      data: createUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingEmail = await users.findOne({ where: { email } });
    if (existingEmail) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "error occuired",
      data: error.message,
    });
  }
};

exports.checkUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const existingUsername = await users.findOne({ where: { username } });
    if (existingUsername) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "error occuired",
      data: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const getData = await users.findOne({
      where: { email: email },
    });

    if (!getData) {
      return res.status(404).json({
        message: "Login Failed, user not found",
      });
    }

    const isPasswordValid = crypt.compareSync(
      password,
      getData.dataValues.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Login Failed, wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: getData.dataValues.id,
        email: getData.dataValues.email,
      },
      process.env.JWT_KEY,
      { expiresIn: 3600 }
    );

    return res.json({
      message: "sukses",
      email: getData.dataValues.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "error occuired",
      data: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    const getDataUser = await users.findOne({
      where: { email: user.email },
    });

    console.log(getDataUser);

    if (!getDataUser) {
      return res.status(404).json({
        message: "users not found",
      });
    }

    res.status(200).json({
      message: "you are logged in",
      data: getDataUser.dataValues,
    });
  } catch (error) {
    res.status(500).json({
      message: "error occuired",
      data: error.message,
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const user = req.user;

    const getDataUser = await users.findOne({
      where: { email: user.email },
    });

    if (!getDataUser) {
      return res.status(404).json({
        message: "users not found",
      });
    }

    const { file, body } = req;
    const { phone, fullname } = body;

    const uploadResult = await cloudinary.uploader.upload(file.path);

    getDataUser.image = uploadResult.secure_url;
    getDataUser.phone = phone;
    getDataUser.fullname = fullname;
    await getDataUser.save();

    res.status(200).json({
      message: "image successfully created",
      data: getDataUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    // await post1.destroy({
    //     where: {
    //         user_id: 3
    //     }
    // })

    // DeleteALL
    await users.destroy({
      truncate: true,
    });

    res.status(200).send({
      message: "all post was deleted from DB",
    });
  } catch (error) {
    res.status(500).send({
      message: `an error occuired`,
      data: error.message,
    });
  }
};
