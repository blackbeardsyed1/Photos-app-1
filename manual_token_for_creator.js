

const jwt = require('jsonwebtoken');

  // The secret key for signing the JWT
const secretKey = 'photos';
  
  // Function to generate a JWT for a user
const generateToken = () => {
    // Define the payload (you can add more fields as needed)
    const payload = {
        user_id: 'Creatorid',
        username: 'Creator2',
        role: 'creator'
      }
  
    // Sign the JWT with the payload and secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
  
    return token;
  };
  
//module.exports = generateToken;
console.log(generateToken());
  