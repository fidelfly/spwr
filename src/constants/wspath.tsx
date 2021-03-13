export const WsPath = {
    auth: {
        login: "/webauth/login",
        logout: "/webauth/logout",
        token: "/webauth/token",
    },
    user: "/user/{id}",
    file: "/file",
    avatar: {
        upload: "/avatar",
        get: "/avatar/{key}",
    },

    queryExist: "/universal/exist/{type}",
};
