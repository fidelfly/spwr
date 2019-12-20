/* eslint-disable */
const proxy = require("http-proxy-middleware");
module.exports = function(app) {
    // app.use(/\/api/, proxy({ target: "http://localhost:8080", secure: false, proxyTimeout: 30000 }));
    app.use(proxy("/api", { target: "http://localhost:8080", secure: false, proxyTimeout: 30000 }));
    app.use(proxy("/api/(websocket|progress)", { target: "ws://localhost:8080", ws: true, secure: false }));
};
