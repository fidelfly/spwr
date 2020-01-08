module.exports = {
    parser: "@typescript-eslint/parser",  // 解析器
    extends: ["plugin:@typescript-eslint/recommended", "react-app", "plugin:prettier/recommended"], // 继承的规则 [扩展]
    plugins: ["@typescript-eslint", "react", "react-hooks"], // 插件
    rules: {  // 规则
        // "additional-typescript-only-rule": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/anchor-is-valid": "off",
    },
};