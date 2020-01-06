export interface MenuItem {
    key: string;
    title: string;
    icon: string;
    sub?: MenuItem[];
    props?: any;
}

export const menus: MenuItem[] = [
    { key: "/app/home", title: "menu.home", icon: "home" },
    {
        key: "/app/profile",
        title: "menu.profile",
        icon: "profile",
        sub: [
            { key: "/app/profile/user", title: "menu.profile.user", icon: "user" },
            { key: "/app/profile/password", title: "menu.profile.password", icon: "safety" },
        ],
    },
];
