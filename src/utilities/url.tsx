import qs from "qs";

function getQueryVariable(): any {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
}

export default { getQueryVariable };
