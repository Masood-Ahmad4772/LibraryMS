const express = require("express");
const {
  addGenre,
  getGenreById,
  getAllGenres,
  updateGenre,
  ActivateGenre,
  DeactivateGenre,
  getActiveGenres,
} = require("../controller/genreController");

const {authMiddleware} = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: API for managing genres
 */

/**
 * @swagger
 * /genre/Add:
 *   post:
 *     summary: Add a new genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Science Fiction"
 *               description:
 *                 type: string
 *                 example: "A genre dealing with futuristic concepts"
 *     responses:
 *       201:
 *         description: Genre added successfully
 */
router.post("/genre/Add", authMiddleware, addGenre);

/**
 * @swagger
 * /genre/getById/{id}:
 *   get:
 *     summary: Get a genre by ID (Public)
 *     tags: [Genres]
 *         security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre details retrieved successfully
 *       404:
 *         description: Genre not found
 */
router.get("/genre/getById/:id", authMiddleware, getGenreById); // No auth required

/**
 * @swagger
 * /genre/getAll:
 *   get:
 *     summary: Retrieve all genres (Requires authentication)
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: List of genres retrieved successfully
 */
router.get("/genre/getAll", authMiddleware, getAllGenres);

/**
 * @swagger
 * /genre/getAllActive:
 *   get:
 *     summary: Get all active genres (Public)
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of active genres retrieved successfully
 */
router.get("/genre/getAllActive", getActiveGenres); // No auth required

/**
 * @swagger
 * /genre/Update/{id}:
 *   put:
 *     summary: Update a genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Genre Name"
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 */
router.put("/genre/Update/:id", authMiddleware, updateGenre);

/**
 * @swagger
 * /genre/Activate/{id}:
 *   patch:
 *     summary: Activate a genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre activated successfully
 *       404:
 *         description: Genre not found
 */
router.patch("/genre/Activate/:id", authMiddleware, ActivateGenre);

/**
 * @swagger
 * /genre/Deactivate/{id}:
 *   patch:
 *     summary: Deactivate a genre
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre deactivated successfully
 *       404:
 *         description: Genre not found
 */
router.patch("/genre/Deactivate/:id", authMiddleware, DeactivateGenre);

module.exports = router;
