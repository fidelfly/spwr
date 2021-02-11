/* eslint-disable */
const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function(app) {
    // app.use(/\/api/, proxy({ target: "http://localhost:8080", secure: false, proxyTimeout: 30000 }));
    app.use("/api", createProxyMiddleware({ target: "http://localhost:9000", secure: false, proxyTimeout: 30000 }));
    // app.use("/api/(websocket|progress)", createProxyMiddleware({ target: "ws://localhost:8080", ws: true, secure: false }));
};