export const errorHandler = (err, req, res, next) => {
    let status = err.statusCode || 500;
    if (status === 500) console.error(err);

    res.status(status).json({
        status,
        message: status === 500 ? "Server error" : err.message,
    });
}