import React, { Component, ReactElement, ReactNode } from "react";
import { PageHeader } from "antd";
import { PageHeaderProps } from "antd/lib/page-header";
import { injectIntl } from "react-intl";
class PageView extends Component<any, any> {
    render(): ReactElement {
        return (
            <div>
                <PageViewHeader {...this.props}></PageViewHeader>
            </div>
        );
    }
}

type PageViewHeaderProps = Partial<PageHeaderProps>;

class PageViewHeader extends Component<PageViewHeaderProps, any> {
    render(): ReactNode {
        const { children, title, ...otherProps } = this.props;
        if (children !== undefined) {
            return children;
        }
        return <PageHeader title={title || ""} {...otherProps}></PageHeader>;
    }
}

//todo
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PageLayout = injectIntl(PageView);

// PageLayout.Header = PageHeader;
