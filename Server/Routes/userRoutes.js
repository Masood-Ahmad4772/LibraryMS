const express = require("express");
const router = express.Router();
const {
  changePassword,
  userUpdate,
  userLogin,
  userSignup,
  getAllUsers,
  addUserType,
  updateUserType,
  getAllUserTypes,
  getAllActiveTypes,
  ActivateUserType,
  DeactivateUserType,
  adminSignup,
  getUserById,
  logoutUser,
  ActivateUser,
  DeactivateUser,
} = require("../controller/userController");
const {authMiddleware} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for user management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: ViewAllUser login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userLogin);

/**
 * @swagger
 * /Signup:
 *   post:
 *     summary: ViewAllUser signup
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: ViewAllUser registered successfully
 */
router.post("/Signup", userSignup);
/**
 * @swagger
 * /adminSignup:
 *   post:
 *     summary: Admin signup
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: ViewAllUser registered successfully
 */
router.post("/addUser", authMiddleware, adminSignup);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized - No valid token provided
 */

router.post("/logout", authMiddleware, logoutUser);

/**
 * @swagger
 * /user/Update/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *     responses:
 *       200:
 *         description: ViewAllUser updated successfully
 */
router.put("/user/Update/:id", authMiddleware, userUpdate);

/**
 * @swagger
 * /user/changePassword:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userName:
 *                 type: string
 *                 example: "userName"
 *                oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *                newPassword:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put("/user/changePassword", authMiddleware, changePassword);

/**
 * @swagger
 * /user/getById/{id}:
 *   get:
 *     summary: Get ViewAllUser By Id
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser ID
 *     responses:
 *       200:
 *         description: ViewAllUser retrieved successfully
 *       404:
 *         description: ViewAllUser not found
 */
router.get("/user/getById/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     summary: Get all users filtered by type
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         required: true
 *         description: Filter users by type (user or admin)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       400:
 *         description: Invalid or missing type
 *       500:
 *         description: Server error
 */
router.get("/users/getAll", authMiddleware, getAllUsers);

/**
 * @swagger
 * tags:
 *   name: ViewAllUser Types
 *   description: API for user type management
 */

/**
 * @swagger
 * /usertype/Add:
 *   post:
 *     summary: Add a new user type
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin"
 *     responses:
 *       201:
 *         description: ViewAllUser type added successfully
 */
router.post("/usertype/Add", authMiddleware, addUserType);

/**
 * @swagger
 * /usertype/Update/{id}:
 *   put:
 *     summary: Update user type
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated ViewAllUser Type"
 *     responses:
 *       200:
 *         description: ViewAllUser type updated successfully
 */
router.put("/usertype/Update/:id", authMiddleware, updateUserType);

/**
 * @swagger
 * /usertype/getAll:
 *   get:
 *     summary: Get all user types
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user types retrieved successfully
 */
router.get("/usertype/getAll", authMiddleware, getAllUserTypes);

/**
 * @swagger
 * /usertype/getAllActive:
 *   get:
 *     summary: Get all active user types
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of active user types retrieved successfully
 */
router.get("/usertype/getAllActive", authMiddleware, getAllActiveTypes);

/**
 * @swagger
 * /usertype/Activate/{id}:
 *   patch:
 *     summary: Activate a user type
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser type ID
 *     responses:
 *       200:
 *         description: ViewAllUser type activated successfully
 */
router.patch("/usertype/Activate/:id", authMiddleware, ActivateUserType);

/**
 * @swagger
 * /usertype/Deactivate/{id}:
 *   patch:
 *     summary: Deactivate a user type
 *     tags: [ViewAllUser Types]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser type ID
 *     responses:
 *       200:
 *         description: ViewAllUser type deactivated successfully
 */
router.patch("/usertype/Deactivate/:id", authMiddleware, DeactivateUserType);

 /**  @swagger
 * /user/ActiveUser/{id}:
 *   put:
 *     summary: Activate a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser ID
 *     responses:
 *       200:
 *         description: ViewAllUser activated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: ViewAllUser not found
 *       500:
 *         description: Internal server error
 */

router.patch("/user/ActiveUser/:id", authMiddleware, ActivateUser)

 /**  @swagger
 * /user/DeactiveUser/{id}:
 *   put:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ViewAllUser ID
 *     responses:
 *       200:
 *         description: ViewAllUser deactivated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: ViewAllUser not found
 *       500:
 *         description: Internal server error
 */
router.patch("/user/DeactiveUser/:id", authMiddleware, DeactivateUser)

module.exports = router;
