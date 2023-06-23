const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://esp-home.local:80',
            changeOrigin: true,
        })
    );
    const wsProxy = createProxyMiddleware("/ws-test", {
        ws: true,
        changeOrigin: true,
        autoRewrite: true,
        target: "http://esp-home.local:80",
    });
    app.use(wsProxy);
};