const liveServer = require("live-server");
const fs = require('fs');
const path = require('path');

function getDirectoryJSON(dirPath, baseUrl) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    return items
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
            name: dirent.name,
            type: "directory",
            url: `${baseUrl}/${dirent.name}`
        }));
}

const params = {
    port: 3000,
    host: "0.0.0.0",
    root: "/workspaces/your-repo-name", // Update to your Codespace path
    open: false,
    middleware: [(req, res, next) => {
        if (req.headers.accept.includes('application/json')) {
            const dirPath = path.join(params.root, req.url);
            const json = getDirectoryJSON(dirPath, req.url);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(json));
        }
        next();
    }]
};

liveServer.start(params);