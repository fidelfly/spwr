import React, {
    ForwardRefRenderFunction,
    MutableRefObject,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Breadcrumb } from "antd";
import { Link, useRouteMatch, matchPath } from "react-router-dom";
import { BreadcrumbProps } from "antd/lib/breadcrumb";
import { useLocation } from "react-router";

export interface BreadcrumbNode {
    url: string;
    title?: string;
    key?: string;
}

export interface BreadcrumbRoute extends BreadcrumbNode {
    path: string;
}

type BreadcrumbRoutes = BreadcrumbRoute[];

const BreadcrumbContext = React.createContext<MutableRefObject<BreadcrumbRef>>({
    current: {
        setRoute: (_) => {
            //do nothing;
        },
        clearRoute: (_) => {
            //do nothing;
        },
    },
});

export const useRouteBreadcrumb = (node?: string, key?: string): [React.FC, MutableRefObject<BreadcrumbRef>] => {
    const match = useRouteMatch();
    const ref = useRef<BreadcrumbRef>({
        setRoute: (_) => {
            //do nothing
        },
        clearRoute: (_) => {
            //do nothing;
        },
    });
    const { url, path } = match;
    useEffect(() => {
        if (node != null) {
            const breadcrumbRef = ref.current;
            console.log(`set route(${node}) : ${url}, ${path}`);
            breadcrumbRef.setRoute({ url: url, path: path, title: node, key: key });
            return () => {
                console.log(`clear route(${node}) : ${url}, ${path}`);
                breadcrumbRef.clearRoute({ url: url, path: path, key: key });
            };
        }
    }, [url, path, node, key, ref]);

    const provider = useCallback(
        (props) => {
            return <BreadcrumbContext.Provider value={ref}>{props.children}</BreadcrumbContext.Provider>;
        },
        [ref]
    );

    return [provider, ref];
};

export const useBreadcrumb = (node: string, key?: string): void => {
    const match = useRouteMatch();
    const { url, path } = match;
    const breadcrumb = useContext(BreadcrumbContext);
    useEffect(() => {
        const breadcrumbRef = breadcrumb.current;
        console.log(`set route(${node}) : ${url}, ${path}`);
        breadcrumbRef.setRoute({ url: url, path: path, title: node, key: key });
        return () => {
            console.log(`clear route(${node}) : ${url}, ${path}`);
            breadcrumbRef.clearRoute({ url: url, path: path, key: key });
        };
    }, [url, path, node, key, breadcrumb]);
};

export type RouteBreadcrumbProps = Omit<BreadcrumbProps, "itemRender" | "routes"> & {
    itemRender?: (index: number, node: BreadcrumbNode) => ReactNode;
};

export type BreadcrumbRef = {
    setRoute: (route: BreadcrumbRoute) => void;
    clearRoute: (route: BreadcrumbRoute) => void;
};

function renderItem(
    index: number,
    route: BreadcrumbRoute,
    routes: BreadcrumbRoutes,
    currentPath: string,
    itemRender?: (index: number, node: BreadcrumbNode) => ReactNode
): ReactNode {
    if (index === routes.length - 1) {
        return itemRender?.(index, route) || route.title;
    }

    const match = matchPath(currentPath, { path: route.path, exact: true });
    if (match != null && match.isExact) {
        return itemRender?.(index, route) || route.title;
    }

    return <Link to={route.url}>{itemRender?.(index, route) || route.title}</Link>;
}

const RouteBreadcrumbRender: ForwardRefRenderFunction<BreadcrumbRef, RouteBreadcrumbProps> = (
    props,
    ref
): ReactElement => {
    const { itemRender, ...others } = props;
    const [routes, setRoutes] = useState<BreadcrumbRoutes>([]);
    const location = useLocation();

    useImperativeHandle(
        ref,
        () => {
            // console.log("Breadcrumb ref current changed");
            return {
                setRoute: (route: BreadcrumbRoute) => {
                    setRoutes(
                        (routes: BreadcrumbRoutes): BreadcrumbRoutes => {
                            // const newRoutes = [...routes];
                            if (routes.length > 0) {
                                const match = matchPath(routes[0].url, { path: route.path });
                                if (match != null) {
                                    if (match.isExact) {
                                        return [route].concat(routes.slice(1));
                                    }

                                    return [route].concat(routes);
                                }
                            }

                            for (let i = routes.length - 1; i >= 0; i--) {
                                const match = matchPath(route.url, { path: routes[i].path });
                                if (match != null) {
                                    if (match.isExact) {
                                        return routes.slice(0, i).concat(route) as BreadcrumbRoutes;
                                    }

                                    return routes.slice(0, i + 1).concat(route) as BreadcrumbRoutes;
                                }
                            }

                            return [route];
                        }
                    );
                },
                clearRoute: (route: BreadcrumbRoute) => {
                    setRoutes(
                        (routes: BreadcrumbRoutes): BreadcrumbRoutes => {
                            for (let i = routes.length - 1; i >= 0; i--) {
                                const match = matchPath(route.url, { path: routes[i].path });
                                if (match != null) {
                                    if (match.isExact) {
                                        return routes.slice(0, i).concat(routes.slice(i + 1)) as BreadcrumbRoutes;
                                    }
                                }
                            }

                            return routes;
                        }
                    );
                },
            };
        },
        []
    );
    return (
        <Breadcrumb {...others}>
            {routes.map((route, index) => {
                return (
                    <Breadcrumb.Item key={route.key || route.url || route.path}>
                        {renderItem(index, route, routes, location.pathname, itemRender)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export const RouteBreadcrumb = React.forwardRef(RouteBreadcrumbRender);
