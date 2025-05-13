const jwt = require("jsonwebtoken");

// const JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Funciones para firmar y verificar tokens
const tokenSign = (user) => {
  const sign = jwt.sign(
    {
      _id: user._id,

      role: user.role,
    },

    JWT_SECRET,

    {
      expiresIn: "20h",
    }
  );

  return sign;
};

// Funcion para firmar token de comercio
const tokenSignComercio = (comercio) => {
  const sign = jwt.sign(
    {
      _id: comercio._id,
      cif: comercio.cif
    },

    JWT_SECRET
  );

  return sign;
}

const verifyToken = (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { tokenSign, tokenSignComercio, verifyToken };
