/* eslint-disable */
const CracoLessPlugin = require("craco-less");
// const darkThemeVars = require("antd/dist/dark-theme");  //to enable dark theme of antd
module.exports = {
    babel: {
      plugins: [
          ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
      ]
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                             hack: `true;@import "${require.resolve("antd/lib/style/color/colorPalette.less")}";`,
                             // ...darkThemeVars, //to enable dark theme of antd
                            "@primary-color": process.env.REACT_APP_THEME_COLOR || "#1DA57A",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
