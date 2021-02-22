import React, { PropsWithChildren, ReactElement } from "react";
import { PageHeader } from "antd";
import { PageHeaderProps } from "antd/lib/page-header";
import { PathBreadcrumb, Route } from "../../components/PathBreadcrumb";

type Props = React.HTMLAttributes<HTMLDivElement>;

interface LayoutType extends React.FC<Props> {
    Header: typeof ViewHeader;
}

const ViewLayout: LayoutType = (props: Props): ReactElement => {
    const { children, ...others } = props;
    others.className = (others.className ? " " : "") + "view-layout";
    return <div {...others}>{children}</div>;
};

type HeadProps = Omit<PageHeaderProps, "breadcrumb" | "breadcrumbRender"> & {
    routes?: Route;
    routeBase?: string;
};

const ViewHeader: React.FC<HeadProps> = (props: PropsWithChildren<HeadProps>): ReactElement => {
    const { children, routes, routeBase, ...others } = props;
    others.className = (others.className ? " " : "") + "view-layout";
    if (routes) {
        (others as PageHeaderProps).breadcrumbRender = () => <PathBreadcrumb base={routeBase || ""} routes={routes} />;
    }

    return <PageHeader {...others}>{children}</PageHeader>;
};

ViewLayout.Header = ViewHeader;
export default ViewLayout;
export { ViewHeader };
