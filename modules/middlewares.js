const ignoreFavicon = (req, res) => {
    if (req.url === '/favicon.ico') {
        res.end();
        return false;
    }
    return true;
}

const setJsonApp = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return true;
}

module.exports = {
    ignoreFavicon,
    setJsonApp
}