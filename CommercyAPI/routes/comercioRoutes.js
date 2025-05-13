// Importo express y el controlador de comercios junto con los validadores de comercios
const express = require("express");
const router = express.Router();
const { checkRol } = require("../middleware/rol");
const { validatorCreateItem, validatorGetItem, validatorActualizarItem, validatorEliminarItem } = require("../validators/comercios");
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/comercioController");
const { authMiddleware } = require("../middleware/session");

// Creo las rutas
/**
 * @openapi
 * /api/comercios:
 *  get:
 *    tags:
 *    - Comercios
 *    summary: "Get all comerces"
 *    description: Get all comerces"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.get("/", authMiddleware, checkRol("admin"), getItems);
/**
 * @openapi
 * /api/comercios/{cif}:
 *  get:
 *    tags:
 *    - Comercios
 *    summary: "Get comerce by cif"
 *    description: Get comerce by cif"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the comerce
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.get("/:cif", authMiddleware, checkRol("admin"), validatorGetItem, getItem);
/**
 * @openapi
 * /api/comercios:
 *  post:
 *    tags:
 *    - Comercios
 *    summary: "Create a comerce"
 *    description: "Create a comerce"
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/postComercio"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.post("/", authMiddleware, validatorCreateItem, checkRol("admin"), createItem);
/**
 * @openapi
 * /api/comercios/{id}/{cif}:
 *  put:
 *    tags:
 *    - Comercios
 *    summary: "Update a comerce"
 *    description: "Update a comerce"
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The comerce ID
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the comerce
 *    requestBody:
 *      required: true  # Es recomendable añadir este campo
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/updateComercio"
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.put("/:id/:cif", authMiddleware, validatorActualizarItem, checkRol("admin"), updateItem);
/**
 * @openapi
 * /api/comercios/{cif}:
 *  delete:
 *    tags:
 *    - Comercios
 *    summary: "Delete a comerce"
 *    description: "Delete a comerce"
 *    parameters:
 *      - in: path
 *        name: cif
 *        schema:
 *          type: string
 *        required: true
 *        description: The cif of the comerce
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *    security:
 *      - bearerAuth: []
 */
router.delete("/:cif", authMiddleware, validatorEliminarItem, checkRol("admin"), deleteItem);

// Exporto las rutas
module.exports = router;