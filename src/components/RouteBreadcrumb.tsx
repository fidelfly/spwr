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

export interface BreadcrumbRoute {
    url: string;
    path: string;
    title?: string;
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

export const useRouteBreadcrumb = (node?: string): [React.FC, MutableRefObject<BreadcrumbRef>] => {
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
            breadcrumbRef.setRoute({ url: url, path: path, title: node });
            return () => {
                console.log(`clear route(${node}) : ${url}, ${path}`);
                breadcrumbRef.clearRoute({ url: url, path: path });
            };
        }
    }, [url, path, node, ref]);

    const provider = useCallback(
        (props) => {
            return <BreadcrumbContext.Provider value={ref}>{props.children}</BreadcrumbContext.Provider>;
        },
        [ref]
    );

    return [provider, ref];
};

export const useBreadcrumb = (node?: string): void => {
    const match = useRouteMatch();
    const { url, path } = match;
    const breadcrumb = useContext(BreadcrumbContext);
    useEffect(() => {
        const breadcrumbRef = breadcrumb.current;
        console.log(`set route(${node}) : ${url}, ${path}`);
        breadcrumbRef.setRoute({ url: url, path: path, title: node });
        return () => {
            console.log(`clear route(${node}) : ${url}, ${path}`);
            breadcrumbRef.clearRoute({ url: url, path: path });
        };
    }, [url, path, node, breadcrumb]);
};

export type RouteBreadcrumbProps = Omit<BreadcrumbProps, "itemRender" | "routes"> & {
    itemRender?: (url: string, title?: string) => ReactNode;
};

export type BreadcrumbRef = {
    setRoute: (route: BreadcrumbRoute) => void;
    clearRoute: (route: BreadcrumbRoute) => void;
};

function renderItem(
    route: BreadcrumbRoute,
    routes: BreadcrumbRoutes,
    currentPath: string,
    itemRender?: (url: string, title?: string) => ReactNode
): ReactNode {
    const match = matchPath(currentPath, { path: route.path, exact: true });
    if (match != null && match.isExact) {
        return route.title;
    }

    return <Link to={route.url}>{itemRender?.(route.url, route.title) || route.title}</Link>;
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
            {routes.map((route) => {
                return (
                    <Breadcrumb.Item key={route.path}>
                        {renderItem(route, routes, location.pathname, itemRender)}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
};

export const RouteBreadcrumb = React.forwardRef(RouteBreadcrumbRender);
