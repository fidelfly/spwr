module.exports = {
    parser: "@typescript-eslint/parser", // Parser
    extends: ["plugin:@typescript-eslint/recommended", "react-app", "plugin:prettier/recommended"], // rule set extended
    plugins: ["@typescript-eslint", "react", "react-hooks"], // plugins
    rules: {
        // rules
        "@typescript-eslint/no-explicit-any": "warn",
        "react-hooks/rules-of-hooks": "error", // rules for Hook
        "react-hooks/exhaustive-deps": "warn", // rules for effect
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
