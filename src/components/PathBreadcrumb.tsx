import { BreadcrumbProps } from "antd/lib/breadcrumb";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export interface Route {
    path: string;
    title: string | ReactNode;
    children?: Route[];
}

export type BreadcrumbNode = Omit<Route, "children">;

function findRoute(route: Route, path: string, parent: string): Omit<Route, "children"> | undefined {
    const routePath = parent + (route.path === "/" ? "" : route.path);
    if (routePath === path || path.startsWith(routePath)) {
        return {
            path: routePath,
            title: route.title,
        };
    }

    return undefined;
}

function resolveBreadcrumb(routes: Route, path: string, base = ""): BreadcrumbNode[] {
    let nodes: BreadcrumbNode[] = [];
    let target: Route[] | undefined = [routes];
    let parentPath: string = base;
    while (target) {
        let route: Omit<Route, "children"> | undefined;
        for (let i = 0; i < target.length; i++) {
            route = findRoute(target[i], path, parentPath);
            if (route !== undefined) {
                nodes = nodes.concat(route);
                target = target[i].children;
                parentPath = route.path;
                break;
            }
        }
        if (route === undefined) {
            break;
        }
    }

    return nodes;
}

type Props = Omit<BreadcrumbProps, "itemRender" | "routes"> & {
    base: string;
    routes: Route;
};

export const PathBreadcrumb: React.FC<Props> = (props: Props): ReactElement => {
    const { base, routes, ...others } = props;
    const [steps, setSteps] = useState<Omit<Route, "children">[]>([]);
    const location = useLocation();

    const path = location.pathname;
    useEffect(() => {
        setSteps(resolveBreadcrumb(routes, path, base));
    }, [path, routes, base]);

    function renderItem(
        route: Omit<Route, "children">,
        routes: Omit<Route, "children">[],
        currentPath: string
    ): ReactNode {
        if (route.path === currentPath) {
            return route.title;
        }

        return <Link to={route.path}>{route.title}</Link>;
    }

    return (
        <Breadcrumb {...others}>
            {steps.map((route) => {
                return (
                    <Breadcrumb.Item key={route.path}>{renderItem(route, steps, location.pathname)}</Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};
