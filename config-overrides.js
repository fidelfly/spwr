/* eslint-disable */
const { override, fixBabelImports, addLessLoader, useEslintRc } = require("customize-cra");
// const fs = require("fs");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const appDirectory = fs.realpathSync(process.cwd());
// const path = require("path");
// const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// const packageJSON = require("./package.json");
const rewireDefinePlugin = require("@yeutech-lab/react-app-rewire-define-plugin"); // TODO need to use react-app-rewired-define-plugin
const darkThemeVars = require('antd/dist/dark-theme');

function makeBasicAuth(user, password) {
    const authKey = user + ":" + password;
    console.log("user : " + user + ", password: " + password);
    return "Basic " + Buffer.from(authKey).toString("base64");
    // return "Basic " + btoa(authKey);
}

function myOverride(config, env) {

    config = rewireDefinePlugin(config, env, {
        "process.env.REACT_APP_OAUTH_KEY": JSON.stringify(
            makeBasicAuth(process.env.REACT_APP_OAUTH_CLIENT, process.env.REACT_APP_OAUTH_PWD)
        ),
    });

    config = override(
        fixBabelImports("import", { libraryName: "antd", libraryDirectory: "es", style: true }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: {
                "@primary-color": process.env.REACT_APP_THEME_COLOR || "#1DA57A",
                'hack': `true;@import "${require.resolve('antd/lib/style/color/colorPalette.less')}";`,
                ...darkThemeVars,
            },
        }),
        // useEslintRc(".eslintrc.js") //eslint-disable-line
        useEslintRc()
    )(config, env);


    /*    //handler multi entries
    var multiEntry = {
        "en-US": resolveApp("src/i18n/en-US.js"),
        "zh-CN": resolveApp("src/i18n/zh-CN.js"),
        main: config.entry,
    };
    config.entry = multiEntry;
    config.output.filename = "static/js/[name].js";

    let options = {
        ...config.plugins[0].options,
        chunks: ["en-US", "zh-CN", "main"],
        chunksSortMode: function(chunk1, chunk2) {
            var order = ["en-US", "zh-CN", "main"];
            var order1 = order.indexOf(chunk1);
            var order2 = order.indexOf(chunk2);
            return order1 - order2;
        },
    };

    config.plugins[0] = new HtmlWebpackPlugin(options);*/
    //handler multi entries end

    return config;
}

module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: myOverride,
/*    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);
            if (packageJSON.https) {
                config.https = {
                    key: fs.readFileSync("./tls/server.key", "utf8"),
                    cert: fs.readFileSync("./tls/server.crt", "utf8"),
                    ca: fs.readFileSync("./tls/ca.crt", "utf8"),
                };
            }
            // Return your customised Webpack Development Server config.
            return config;
        };
    },*/
};
