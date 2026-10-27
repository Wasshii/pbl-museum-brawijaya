const jwt = require("jsonwebtoken");

exports.createToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
