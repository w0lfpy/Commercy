const handleHttpError = (res, message = "Something went wrong", code = 500) => {
    if (res && typeof res.status === 'function') {
        res.status(code).json({ error: message });
    } else {
        console.error("Invalid response object passed to handleHttpError. Message:", message);
    }
};

module.exports = {handleHttpError};