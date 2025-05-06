const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const authenticate = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage(); // keep file in memory for blob upload
const upload = multer({ storage });

router.post('/upload', authenticate, upload.single('file'), photoController.upload);
router.get('/photos', photoController.getAll);
router.get('/photos/user', authenticate, photoController.getUserPhotos);
router.get('/photos/:photo_title', photoController.getDetails);
router.post('/photos/:photo_title/comment', authenticate, photoController.addComment);
router.post('/photos/:photo_title/rate', authenticate, photoController.addRating);
router.get('/photos/search',authenticate, photoController.search);

module.exports = router;
