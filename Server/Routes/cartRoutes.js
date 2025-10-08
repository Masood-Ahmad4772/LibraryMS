const express = require('express');
const {getCart, AddToCartGuest, AddToCartUser, removeItem} = require("../controller/cartController");
const {authMiddleware} = require("../middleware/authMiddleware");
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing cart
 */

/**
 * @swagger
 * /user/addToCart:
 *   post:
 *     summary: Add to Cart of ViewAllUser
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []  # This route requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "userid"
 *               bookId:
 *                 type: string
 *                 example: "BookId"
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Added to Cart successfully
 */
router.post("/user/addToCart", authMiddleware, AddToCartUser);
/**
 * @swagger
 * /addToCart:
 *   post:
 *     summary: Add to Cart of Guest
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: string
 *                 example: "guestId"
 *               bookId:
 *                 type: string
 *                 example: "BookId"
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Added to Cart successfully
 */
router.post("/addToCart", AddToCartGuest);
/**
 * @swagger
 * /getCart:
 *   get:
 *     summary: Retrieve all Cart Data (Public)
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
router.get("/getCart/:userId?", getCart);

/**
 * @swagger
 * /cart/remove/{userId}:
 *   delete:
 *     summary: Remove an item from the cart by item ID and user ID or guest ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional ViewAllUser ID (if logged in)
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the item to remove from the cart
 *       - in: cookie
 *         name: guestId
 *         required: false
 *         schema:
 *           type: string
 *         description: Guest ID stored in cookies (used if userId is not provided)
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

router.delete('/cart/remove/:userId?', removeItem);


module.exports = router;