module.exports = {
    parser: "@typescript-eslint/parser", // 解析器
    extends: ["plugin:@typescript-eslint/recommended", "react-app", "plugin:prettier/recommended"], // 继承的规则 [扩展]
    plugins: ["@typescript-eslint", "react", "react-hooks"], // 插件
    rules: {
        // 规则
        "@typescript-eslint/no-explicit-any": "warn",
        "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
        "react-hooks/exhaustive-deps": "warn", // 检查 effect 的依赖
        "jsx-a11y/anchor-is-valid": "off",
        "import/no-anonymous-default-export": [
            "error",
            {
                allowArray: false,
                allowArrowFunction: false,
                allowAnonymousClass: false,
                allowAnonymousFunction: false,
                allowCallExpression: true, // The true value here is for backward compatibility
                allowLiteral: false,
                allowObject: true,
            },
        ],
    },
};
