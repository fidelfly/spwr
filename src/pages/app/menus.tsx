import { HomeOutlined, UserOutlined, ProfileOutlined, SafetyOutlined } from "@ant-design/icons/lib";
import React, { ReactNode } from "react";

export interface MenuItem {
    key: string;
    title: string;
    icon: ReactNode;
    sub?: MenuItem[];
    props?: Record<string, unknown>;
}

export const menus: MenuItem[] = [
    { key: "/app/home", title: "menu.home", icon: <HomeOutlined /> },
    {
        key: "/app/profile",
        title: "menu.profile",
        icon: <ProfileOutlined />,
        sub: [
            { key: "/app/profile/user", title: "menu.profile.user", icon: <UserOutlined /> },
            { key: "/app/profile/password", title: "menu.profile.password", icon: <SafetyOutlined /> },
        ],
    },
];
