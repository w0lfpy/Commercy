// Importaciones de los módulos necesarios para el funcionamiento de las rutas 
const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../utils/handleStorage');
const { validatorCreateItem, validatorGetItem, validatorActualizarItem, validatorEliminarItem } = require('../validators/web');
const { createWebPage, createFile, getItems, getItem, getInterestWeb, createItem, updateItem, deleteItem, restoreWeb } = require('../controllers/webController');
const { comercioMiddleware } = require('../middleware/session');

// Creación de las rutas
/**
 * @openapi
 * /api/web:
 *  get:
 *    tags:
 *    - Web
 *    summary: "Get all webs"
 *    description: Get all webs"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 */
router.get('/', getItems);
/**
 * @openapi
 * /api/web/{id}:
 *  get:
 *    tags:
 *    - Web
 *    summary: "Get web by id"
 *    description: Get web by id"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the web
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 */
router.get('/:id', validatorGetItem, getItem);
/**
 * @openapi
 * /api/web/userInterested/{cif}:
 *  get:
 *    tags:
 *    - Web
 *    summary: "Get all users interested in a web"
 *    description: "Get all users interested in a web"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the web
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.get('/userInterested/:cif', comercioMiddleware, getInterestWeb);
/**
 * @openapi
 * /api/web:
 *  post:
 *    tags:
 *    - Web
 *    summary: "Create a web"
 *    description: "Create a web"
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/postWeb"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.post('/', comercioMiddleware, validatorCreateItem, createWebPage);
/**
 * @openapi
 * /api/web/{cif}:
 *  put:
 *    tags:
 *    - Web
 *    summary: "Update a web"
 *    description: "Update a web"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The web cif
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/updateWeb"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.put('/:cif', comercioMiddleware, validatorActualizarItem, updateItem);
/**
 * @openapi
 * /api/web/{cif}:
 *  delete:
 *    tags:
 *    - Web
 *    summary: "Delete a web"
 *    description: "Delete a web"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the web
 *      - in: query
 *        name: soft
 *        schema:
 *          type: string
 *          enum: ["True", "False"]  # Dropdown options
 *        required: false
 *        description: Soft delete ("True") or hard delete ("False")
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.delete('/:cif', comercioMiddleware, deleteItem);

/**
 * @openapi
 * /api/web/restore/{cif}:
 *  put:
 *    tags:
 *    - Web
 *    summary: "Restore a web"
 *    description: "Restore a web"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the comerce associated with the web
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.put('/restore/:cif', comercioMiddleware, restoreWeb);

/**
 * @openapi
 * /api/web/{cif}/upload-image:
 *  patch:
 *    tags:
 *    - Web
 *    summary: "Upload image"
 *    description: "Upload image to the specified web entry"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: Cif of the web entry to which the image will be added
 *    requestBody:
 *      required: false
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *                description: The image file to upload
 *              texts:
 *                type: array
 *                description: Array of texts to add to the web entry
 *    responses:
 *      '200':
 *        description: Image uploaded successfully, returns the updated web entry
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/patchImg"
 *      '400':
 *        description: No image file uploaded
 *      '401':
 *        description: Unauthorized, token missing or invalid
 *      '404':
 *        description: Web entry not found
 *      '500':
 *        description: Server error
 *    security:
 *      - bearerAuth: []
 */
router.patch('/:cif/upload-image', uploadMiddleware.single('image'), createFile);

// Exportación de las rutas
module.exports = router;