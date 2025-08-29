const {genreValidation} = require('../validators/genreValidation');
const {Genre, Book} = require("../models/booksModels");

const addGenre = async (req, res) => {
  const {error} = genreValidation(req.body);
  if (error) return res.status(400).send("Error:", error)

  try {
    const newGenre = new Genre({
      name: req.body.name,
      validFlag: true,
    })
    await newGenre.save()
    res.status(201).send("Genre Added Successfully")
  } catch (err) {
    res.status(500).send('Error Adding Genre' + err);
  }
}
const getGenreById = async (req, res) => {
  if (!req.params.id) return res.status(404).send("Not Found");
  try {
    const genreById = await Genre.findOne({_id: req.params.id});
    res.status(200).send(genreById)
  } catch (err) {
    res.status(500).send("Error:", err);
  }
}
const getActiveGenres = async (req, res) => {
  try {
    const genres = await Genre.find({validFlag: true});
    res.status(200).send(genres)
  } catch (err) {
    res.status(500).send("Error:", err);
  }
}
const getAllGenres = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalRecords = await Genre.countDocuments();
  try {
    const genres = await Genre.find().skip((page - 1) * limit).limit(limit);
    res.status(200).json({
      totalRecords: totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      genres
    });
  } catch (err) {
    res.status(500).send("Error:", err);
  }
}
const updateGenre = async (req, res) => {
  if (!req.params.id) return res.status(400).send("Genre Id not found");
  try {
    const {error} = genreValidation(req.body);
    if (error) return res.status(400).send("Error:", error);
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {$set: req.body}, {
      new: true,
      runValidators: true
    })
    if (!updatedGenre) {
      return res.status(404).send("Genre Not Found");
    }
    res.status(200).send("Genre Updated Successfully")
  } catch (err) {
    res.status(500).send('Error Adding Genre' + err);
  }
}
const ActivateGenre = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Id not found');
  }
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {validFlag: true}, {new: true})
    if (!updatedGenre) {
      return res.status(404).send('Genre not found');
    }
    res.status(200).send("Genre Activated");
  } catch (err) {
    res.status(500).send('Error updating Genre' + err);
  }
}
const DeactivateGenre = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Id not found');
  }
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {validFlag: false}, {new: true})
    if (!updatedGenre) {
      return res.status(404).send('Genre not found');
    }
    res.status(200).send("Genre Deactivated");
  } catch (err) {
    res.status(500).send('Error updating Genre' + err);
  }
}
module.exports = {addGenre, getGenreById, getAllGenres, updateGenre, ActivateGenre, DeactivateGenre, getActiveGenres}