import { UserOutlined, ProfileOutlined, SafetyOutlined } from "@ant-design/icons/lib";
import React, { ReactNode } from "react";

export interface MenuItem {
    key: string;
    title: string;
    icon: ReactNode;
    sub?: MenuItem[];
    props?: Record<string, unknown>;
}

export const menus: MenuItem[] = [
    /*  { key: "/app/home", title: "menu.home", icon: <HomeOutlined /> },*/
    {
        key: "/app/account",
        title: "menu.account",
        icon: <ProfileOutlined />,
        sub: [
            { key: "/app/account/profile", title: "menu.account.profile", icon: <UserOutlined /> },
            { key: "/app/account/password", title: "menu.account.password", icon: <SafetyOutlined /> },
        ],
    },
];
