import { BreadcrumbProps } from "antd/lib/breadcrumb";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { useLocation, matchPath } from "react-router";
import { Link } from "react-router-dom";

export interface BreadcrumbRoute {
    path: string;
    title: string | ReactNode;
    children?: BreadcrumbRoute[];
}

export type BreadcrumbNode = Omit<BreadcrumbRoute, "children">;

function findRoute(route: BreadcrumbRoute, path: string, parent: string): BreadcrumbNode | undefined {
    const routePath = parent + (route.path === "/" ? "" : route.path);
    const match = matchPath(path, { path: routePath });
    if (match != null) {
        return {
            path: match.url,
            title: route.title,
        };
    }

    return undefined;
}

function resolveBreadcrumb(routes: BreadcrumbRoute, path: string, base = ""): BreadcrumbNode[] {
    let nodes: BreadcrumbNode[] = [];
    let target: BreadcrumbRoute[] | undefined = [routes];
    let parentPath: string = base;
    while (target) {
        let route: BreadcrumbNode | undefined;
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

export type Props = Omit<BreadcrumbProps, "itemRender" | "routes"> & {
    base: string;
    routes: BreadcrumbRoute;
};

export const PathBreadcrumb: React.FC<Props> = (props: Props): ReactElement => {
    const { base, routes, ...others } = props;
    const [steps, setSteps] = useState<Omit<BreadcrumbRoute, "children">[]>([]);
    const location = useLocation();

    const path = location.pathname;
    useEffect(() => {
        setSteps(resolveBreadcrumb(routes, path, base));
    }, [path, routes, base]);

    function renderItem(route: BreadcrumbNode, routes: BreadcrumbNode[], currentPath: string): ReactNode {
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
