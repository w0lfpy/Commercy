const { IncomingWebhook } = require("@slack/webhook");

// Función para enviar mensajes a slack
const loggerStream = (url) =>{
    const webHook = new IncomingWebhook(url);
    return {
        write: (message) => {
            webHook.send({
                text: message,
            });
        },
    };
};

module.exports = loggerStream;