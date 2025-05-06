const fs = require('fs');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const uploadToBlob = require('../utils/blobUpload');


exports.upload = async (req, res) => {
  try {
    const file = req.file;
    const { title, caption = '', location = '' } = req.body;

    if (!file || !title) {
      return res.status(400).json({ error: 'File and title are required' });
    }

    // Upload the file buffer directly to Azure Blob
    const blobUrl = await uploadToBlob(file.buffer, file.originalname);

    const photo = new Photo({
      title,
      caption,
      location,
      blob_url: blobUrl,
      uploaded_by: req.user.user_id,
      username: req.user.username,
      uploaded_at: new Date()
    });

    await photo.save();

    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        title,
        caption,
        location,
        blob_url: blobUrl
      }
    });
  } catch (err) {
    console.error('Upload error:', err); // Add this
    res.status(500).json({ error: err.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const photos = await Photo.find({}, '-_id');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ uploaded_by: req.user.user_id }, '-_id');
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const photo = await Photo.findOne({ title: req.params.photo_title }, '-_id');
    if (!photo) return res.status(404).json({ error: 'Photo not found' });

    const comments = await Comment.find({ photo_title: req.params.photo_title }, '-_id');

    const ratingAgg = await Rating.aggregate([
      { $match: { photo_title: req.params.photo_title } },
      { $group: { _id: '$photo_title', average: { $avg: '$rating' } } }
    ]);

    const average_rating = ratingAgg[0]?.average || 0;

    res.json({ photo, comments, average_rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text is required' });

  try {
    const comment = new Comment({
      photo_title: req.params.photo_title,
      user_id: req.user.user_id,
      username: req.user.username,
      text,
      timestamp: new Date()
    });

    await comment.save();
    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRating = async (req, res) => {
  const { rating } = req.body;

  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }

  try {
    const existing = await Rating.findOne({
      photo_title: req.params.photo_title,
      user_id: req.user.user_id
    });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated successfully' });
    }

    const newRating = new Rating({
      photo_title: req.params.photo_title,
      user_id: req.user.user_id,
      username: req.user.username,
      rating,
      timestamp: new Date()
    });

    await newRating.save();
    res.json({ message: 'Rating added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.search = async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Search query is required' });

  try {
    const regex = new RegExp(q, 'i');
    const results = await Photo.find({
      $or: [
        { title: regex },
        { caption: regex },
        { location: regex },
        { username: regex }
      ]
    }, '-_id');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
