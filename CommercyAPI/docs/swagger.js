const swaggerJsdoc = require("swagger-jsdoc");
const { get } = require("mongoose");
const { postReviewWeb } = require("../controllers/authController");

const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Commercy API with Swagger",
        version: "3.0.0",
        description:
          "This is a CRUD API application made with Express and documented with Swagger",
        contact: {
          name: "Jose Suárez Ares",
          email: "jose.suarez.ceb@immune.institute.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas:{
            user: {
                type: "object",
                required: ["name", "age", "email", "password"],
                properties: {
                    name: {
                        type: "string",
                        example: "Menganito"
                    },
                    age: {
                        type: "integer",
                        example: 20
                    },
                    email: {
                        type: "string",
                        example: "miemail1409@google.com"
                    },
                    password: {
                        type: "string",
                        example: "123456789"
                    },
                    ciudad: {
                        type: "string",
                        example: "Madrid"
                    },
                    intereses: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    ofertas: {
                        type: "boolean",
                        example: true
                    },
                },
            },
            postReviewWeb: {
                type: "object",
                required: ["scoring", "puntuacion", "texto"],
                properties: {
                    scoring: {
                        type: "number",
                        example: 2
                    },
                    puntuacion: {
                        type: "number",
                        example: 4
                    },
                    texto: {
                        type: "string",
                        example: "Mejorable, pero buen servicio"
                    }
                }
            },
            login: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "miemail1409@google.com"
                  },
                  password: {
                    type: "string",
                    example: "123456789"
                  },
                }
            },
            updateUser: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        example: "Menganito"
                    },
                    age: {
                        type: "integer",
                        example: 20
                    },
                    email: {
                        type: "string",
                        example: "menganito@gmail.com",
                    },
                    ciudad: {
                        type: "string",
                        example: "Madrid"
                    },
                    intereses: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    ofertas: {
                        type: "boolean",
                        example: true
                    },
                }
            },
            postComercio: {
                type: "object",
                required: ["nombre", "cif", "direccion", "ciudad", "telefono", "email"],
                properties: {
                    nombre: {
                        type: "string",
                        example: "Mi comercio"
                    },
                    cif: {
                        type: "string",
                        example: "A12345678"
                    },
                    direccion: {
                        type: "string",
                        example: "Calle falsa 123"
                    },
                    email: {
                        type: "string",
                        example: "miComercio@gmail.com"
                    },
                    telefono: {
                        type: "string",
                        example: "123456789"
                    },
                    id: {
                        type: "integer",
                        example: 1
                    }
                }
            },
            updateComercio: {
                type: "object",
                properties: {
                    nombre: {
                        type: "string",
                        example: "Tienda de Bicis"
                    },
                    direccion: {
                        type: "string",
                        example: "Calle de la fantasia 123"
                    },
                    email: {
                        type: "string",
                        example: "miComercioTest2@gmail.com"
                    },
                    telefono: {
                        type: "string",
                        example: "689354024"
                    },
                    id: {
                        type: "integer",
                        example: 10
                    }
                }
            },
            postWeb: {
                type: "object",
                required: ["ciudad", "actividad", "titulo", "resumen", "textos", "imagenes", "cifComercio"],
                properties: {
                    ciudad: {
                        type: "string",
                        example: "Madrid"
                    },
                    actividad: {
                        type: "string",
                        example: "Restaurante"
                    },
                    titulo: {
                        type: "string",
                        example: "Mi restaurante"
                    },
                    resumen: {
                        type: "string",
                        example: "Un restaurante muy bueno"
                    },
                    cifComercio: {
                        type: "string",
                        example: "A12345678"
                    },
                }
            },
            updateWeb: {
                type: "object",
                properties: {
                    ciudad: {
                        type: "string",
                        example: "Zaragoza"
                    },
                    actividad: {
                        type: "string",
                        example: "Tienda de motos"
                    },
                    titulo: {
                        type: "string",
                        example: "Mi Tienda de motos"
                    },
                    resumen: {
                        type: "string",
                        example: "Una tienda muy buena"
                    },
                }
            },
            patchImg: {
                type: "object",
                properties: {
                    imagen: {
                        type: "string",
                        example: "imagen.jpg"
                    }
                }
            },
        },
      },
    },
    apis: ["./routes/*.js"],
  };
  
module.exports = swaggerJsdoc(options)