const express = require('express');
const { registerCntrl, loginCntrl, updateCntrl, deleteCntrl, getComerciosFilter, postReviewWeb } = require("../controllers/authController");
const router = express.Router();
const {authMiddleware} = require("../middleware/session");
const { validatorRegister, validatorLogin, validatorUpdate, validatorReviewWeb } = require("../validators/auth");

/**
 * @openapi
 * /api/user/register:
 *  post:
 *    tags:
 *    - User
 *    summary: "User register"
 *    description: Register a new user
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/user"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 */
router.post("/register", validatorRegister, registerCntrl);
/**
 * @openapi
 * /api/user/login:
 *  post:
 *    tags:
 *    - User
 *    summary: "Login user"
 *    description: "Authenticate a user"
 *    requestBody:
 *      required: true  # Requerir cuerpo de la solicitud
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/login"
 *    responses:
 *      '200':
 *        description: Returns the authenticated user or token
 *      '401':
 *        description: Validation error or authentication failure
 */
router.post("/login", validatorLogin, loginCntrl);
/**
 * @openapi
 * /api/user/updateUser/{id}:
 *  put:
 *    tags:
 *    - User
 *    summary: "Update a user"
 *    description: "Update a user"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the user
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/updateUser"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.put("/updateUser/:id", authMiddleware, validatorUpdate, updateCntrl);
/**
 * @openapi
 * /api/user/deleteUser/{id}:
 *  delete:
 *    tags:
 *    - User
 *    summary: "Delete a user"
 *    description: "Delete a user"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the user
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.delete("/deleteUser/:id", authMiddleware, deleteCntrl);

/**
 * @openapi
 * /api/user/comerciosFilter/{ciudad}/:intereses?:
 *  get:
 *    tags:
 *    - User
 *    summary: "Get comercios by filter"
 *    description: "Get comercios filtered by city and optionally by interests"
 *    parameters:
 *      - in: path
 *        name: ciudad
 *        schema:
 *          type: string
 *        required: true
 *        description: The city of the user
 *      - in: query
 *        name: intereses
 *        schema:
 *          type: string
 *        required: false
 *        description: The interests of the user
 *      - in: query
 *        name: Ordenar por scoring
 *        schema:
 *          type: string
 *          enum: ["true", "false"]  # Creates dropdown options in Swagger UI
 *        required: true
 *        description: "Choose 'true' to sort results by scoring, 'false' for no sorting"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 */
router.get("/comerciosFilter/:ciudad/:intereses?", getComerciosFilter);

/**
 * @openapi
 * /api/user/writeReview/{id}:
 *  post:
 *    tags:
 *    - User
 *    summary: "Write Review"
 *    description: "Write a review for a comerce"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the web
 *    requestBody:
 *      required: true  # Requerir cuerpo de la solicitud
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/postReviewWeb"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.post("/writeReview/:id", authMiddleware, validatorReviewWeb, postReviewWeb);

module.exports = router;