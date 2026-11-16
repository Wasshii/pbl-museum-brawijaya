const jwt = require("jsonwebtoken");

exports.createToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
    );

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

// Token pengunjung aplikasi mobile. role "visitor" sehingga tidak bisa membuka
// endpoint admin (requireAdmin hanya menerima role "admin").
exports.createVisitorToken = (visitor) =>
    jwt.sign({ id: visitor.id, role: "visitor" }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
