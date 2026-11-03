import jwt from 'jsonwebtoken';

/**
 * Generate a signed JSON Web Token (JWT)
 * @param {string} id - MongoDB User ObjectId
 * @param {string} role - User role ('customer', 'vendor', 'admin')
 * @returns {string} Signed JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'multivendor_super_secret_jwt_key_2026_dev',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

export default generateToken;
