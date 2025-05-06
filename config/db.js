const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
