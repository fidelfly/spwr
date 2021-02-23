import React, { PropsWithChildren, ReactElement } from "react";
import { PageHeader } from "antd";
import { PageHeaderProps } from "antd/lib/page-header";
import { PathBreadcrumb, Props as BreadcrumbProps } from "../../components/PathBreadcrumb";
import "../style/ViewLayout.less";

type Props = React.HTMLAttributes<HTMLDivElement>;

/*interface LayoutType extends React.FC<Props> {
    Header: typeof ViewHeader;
}*/

const ViewLayout: React.FC<Props> = (props: Props): ReactElement => {
    const { children, ...others } = props;
    others.className = (others.className ? " " : "") + "view-layout";
    return <div {...others}>{children}</div>;
};

const ViewContent: React.FC<Props> = (props: Props): ReactElement => {
    const { children, ...others } = props;
    others.className = (others.className ? " " : "") + "view-content";
    return <div {...others}>{children}</div>;
};

type HeadProps = Omit<PageHeaderProps, "breadcrumb" | "breadcrumbRender" | "extra"> & {
    breadcrumb?: BreadcrumbProps;
    toolbar?: React.ReactNode;
};

const ViewHeader: React.FC<HeadProps> = (props: PropsWithChildren<HeadProps>): ReactElement => {
    const { children, breadcrumb, toolbar, ...others } = props;
    others.className = (others.className ? " " : "") + "view-layout";
    if (breadcrumb) {
        (others as PageHeaderProps).breadcrumbRender = () => <PathBreadcrumb {...breadcrumb} />;
    }
    if (toolbar) {
        (others as PageHeaderProps).extra = toolbar;
    }

    return <PageHeader {...others}>{children}</PageHeader>;
};

export default ViewLayout;
export { ViewHeader, ViewContent };
