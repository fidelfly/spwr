const zh = "zh";
const en = "en";

const locales: Record<string, string> = {
    zh: "zh-CN",
    en: "en-US",
};

function getLocaleCode(lang: string): string {
    return locales[lang] || lang;
}

export default { zh, en, getLocaleCode };
