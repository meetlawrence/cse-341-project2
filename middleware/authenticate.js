const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json("You do not have access to this resource");
    }
    next();
};

module.exports = {
    isAuthenticated
};