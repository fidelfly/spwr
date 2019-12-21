export interface LayoutState {
    theme: string;
    collapsed: boolean;
    sideWidth: number;
}

export interface Token {
    userId?: number;
}

export interface StoreState {
    language: string;
    verifyToken: boolean;
    layout: LayoutState;
    token?: Token;
}
