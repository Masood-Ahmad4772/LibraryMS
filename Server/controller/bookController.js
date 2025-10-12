const {bookValidation} = require('../validators/bookValidation');
const {Book, Genre} = require('../models/booksModels');
const fs = require('fs');
const path = require('path');


const addBook = async (req, res) => {
  console.log("data", req.body)
  const {error} = bookValidation(req.body, req.file);
  if (error) return res.status(400).send('Error' + error);

  try {
    const BookObject = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      quantity: req.body.quantity,
      image: `/uploads/${req.folderName}/${req.file.filename}`,
      validFlag: true
    });
    await BookObject.save();
    res.status(201).json("Book Added SuccessFully")
  } catch (err) {
    res.status(500).send("Error" + err)
  }
}
const getBookById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Enter an id')
  }
  try {
    const bookById = await Book.findOne({_id: req.params.id}).populate('genre', "name");
    if (!bookById) {
      return res.status(404).send('Book not Found');
    }
    res.status(200).send(bookById)
  } catch (err) {
    res.status(500).send('Error:' + err)
  }
}
const getAllBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const title = req.query.title || 'title';
    const {Genre = ['all'], Status = 'all'} = req.body;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const totalRecords = await Book.countDocuments();
    try {
        const filter = {};
        if (Array.isArray(Genre) && Genre.length > 0 && !Genre.includes("all")) {
            filter.genre = {$in: Genre};
        }
        if (Status !== undefined && Status !== null && String(Status).toLowerCase() !== "all") {
            filter.validFlag = Status;
        }
        const books = await Book.find(filter)
            .populate("genre", "name")
            .sort({[title]: sortOrder})
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            filteredRecord: books.length,
            books
        })
    } catch (err) {
        res.status(500).send('Error' + err);
    }
}
const getActiveBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const totalRecords = await Book.countDocuments();
    const books = await Book.find({validFlag: true})
      .populate('genre', 'name').skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      totalRecords: totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      books
    });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
};
const getBooksByGenre = async (req, res) => {
  if (!req.params.genre) {
    try {
      const books = await Book.find({validFlag: true}).populate('genre', "name");
      return res.status(200).send(books)
    } catch (err) {
      return res.status(500).send('Error' + err);
    }
  } else {
    try {
      const books = await Book.find({validFlag: true, genre: req.params.genre}).populate('genre', "name");
      res.status(200).send(books)
    } catch (err) {
      res.status(500).send('Error' + err);
    }
  }
}
const updateBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Id not found');
  }
  var imagePath = null;
  const {error} = bookValidation(req.body);
  if (error) return res.status(400).send("Error: " + error);
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    if (req.file) {
      if (book.image) {
        const oldImagePath = path.join(__dirname, `../uploads/${req.folderName}`, book.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.folderName}/${req.file.filename}`
    }
    if (!req.file) {
      imagePath = book.image;
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {$set: req.body, image: imagePath},
      {new: true, runValidators: true}
    );
    if (!updatedBook) {
      return res.status(404).send('Book not Found');
    }
      res.status(200).json({ message: "Book Updated Successfully" });
  } catch (err) {
    res.status(500).send('Error updating book' + err);
  }
}
const ActivateBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Id not found');
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {validFlag: true}, {new: true})
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    res.status(200).json({message:"Book Activated"});
  } catch (err) {
    res.status(500).send('Error updating book' + err);
  }
}
const DeactivateBook = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Id not found');
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {validFlag: false}, {new: true})
    if (!updatedBook) {
      return res.status(404).send('Book not found');
    }
    res.status(200).json({message: "Book Deactivated"});
  } catch (err) {
    res.status(500).send('Error updating book' + err);
  }
}
const getBookFilters = async (req, res) => {
  const genres = await Genre.find({validFlag: true});
  try {
    if (!genres) {
      return res.status(400).send('No genre found! No filters were found');
    }
    const filters = [
      {
        label: 'Genre',
        type: 'multiple',
        options: [
          {value: 'all', label: 'All'},
          ...genres.map((item) => ({
            value: item._id,
            label: item.name,
          })),
        ],
      },
      {
        label: 'Status',
        type: 'single',
        options: [
          {value: 'all', label: 'All'},
          {value: true, label: 'Active'},
          {value: false, label: 'Inactive'},
        ],
      },
    ];
    res.status(200).json(filters);
  } catch (e) {
    res.status(500).send('Error getting books:' + e);
  }
}
module.exports = {
  getBooksByGenre,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  ActivateBook,
  DeactivateBook,
  getActiveBooks,
  getBookFilters
}