export type Theme = "dark" | "light";

export interface LayoutState {
    theme: Theme;
    collapsed: boolean;
    sideWidth: number;
}

export interface Token {
    userId: number;
}

export interface User {
    id: number;
    code: string;
    name: string;
    email: string;
    avatar: number;
}

export interface StoreState {
    language: string;
    verifyToken: boolean;
    layout: LayoutState;
    token?: Token;
    user?: User;
}
