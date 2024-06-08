const express = require("express");
const cors = require("cors");
const service = require("../service/Service");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer to store files in 'uploads/' directory

const app = express();
const port = 3001;

// Middleware to parse JSON body
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Route for user registration
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    await service.register(email, password, name);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await service.login(email, password);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Route for logout
app.post("/logout", async (req, res) => {
  const { email } = req.body;
  await service.logout(email);
  res.status(200).json({ message: "Logout successful" });
});

// Route for upLoadFile
app.post("/upLoadFile", upload.single('file'), async (req, res) => {
  console.log("Received file upload request:", req.body); // Added this line for debugging
  const email = req.body.email;
  const file = req.file; // The uploaded file's information
  const model = req.body.model; // The selected model

  try {
    // Process the file, email, and selected model
    let result = await service.upLoadFile(email, file.path, model);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} else {
  module.exports = app;
}
