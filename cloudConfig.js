const cloudinary = require("cloudinary").v2; // Import the cloudinary library for image management
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Import the CloudinaryStorage class for storing images in Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});
// The above code configures Cloudinary to store images in a specific folder and allows for dynamic naming of the files

module.exports = {
  cloudinary,
  storage,
};
