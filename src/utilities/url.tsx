import qs from "qs";

function getQueryVariable(): Record<string, unknown> {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
}

export default { getQueryVariable };
