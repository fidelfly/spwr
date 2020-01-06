import React, { Component, ReactElement } from "react";
import { IntlProps, ReduxProps, StoreState, Theme } from "../../type";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { MenuItem, menus } from "./menus";
import { Path } from "../../utilities";
import { Menu, Icon } from "antd";
import { SelectParam, MenuProps } from "antd/lib/menu";

interface Props extends MenuProps {
    theme: Theme;
    collapsed: boolean;
}

interface State {
    path?: string;
    selectedKeys: string[];
    openKeys: string[];
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        theme: state.layout.theme,
        collapsed: state.layout.collapsed,
    };
};

type MenuViewProps = IntlProps & ReduxProps & RouteComponentProps & Props & any;

class MenuView extends Component<MenuViewProps, State> {
    constructor(props: MenuViewProps) {
        super(props);
        this.state = {
            selectedKeys: [],
            openKeys: [],
        };
    }

    static getDerivedStateFromProps(nextProps: MenuViewProps, prevState: State): State | null {
        const path = nextProps.location.pathname;
        if (path !== prevState.path) {
            let { openKeys } = prevState;
            if (nextProps.collapsed) {
                openKeys = [];
            } else {
                const parentPath = Path.getParent(path);
                if (parentPath !== path) {
                    if (openKeys.indexOf(parentPath) < 0) {
                        openKeys = [...openKeys, parentPath];
                    }
                }
            }
            return {
                selectedKeys: [path],
                openKeys: openKeys,
                path: path,
            };
        }
        return null;
    }

    renderMenuItem = (item: MenuItem): ReactElement => {
        return (
            <Menu.Item key={item.key} {...item.props}>
                <Link to={item.key}>
                    {item.icon && <Icon type={item.icon} className={"menu-icon"} />}
                    <span>
                        <FormattedMessage id={item.title} defaultMessage={item.title} />
                    </span>
                </Link>
            </Menu.Item>
        );
    };

    renderSubMenu = (item: MenuItem): ReactElement => {
        return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        {item.icon && <Icon type={item.icon} className={"menu-icon"} />}
                        <span>
                            <FormattedMessage id={item.title} defaultMessage={item.title} />
                        </span>
                    </span>
                }
                {...item.props}>
                {item.sub && item.sub.map((item) => this.renderMenuItem(item))}
            </Menu.SubMenu>
        );
    };

    onOpenChange = (openKeys: string[]): void => {
        this.setState({
            openKeys: openKeys,
        });
    };

    onDeselect = (param: SelectParam): void => {
        this.setState({
            selectedKeys: param.selectedKeys,
        });
    };

    onSelect = (param: SelectParam): void => {
        this.setState({
            selectedKeys: param.selectedKeys,
        });
    };

    render(): ReactElement {
        const { collapsed, theme, ...otherProps } = this.props;
        return (
            <Menu
                inlineCollapsed={this.props.collapsed}
                mode={collapsed ? "vertical" : "inline"}
                theme={theme}
                selectedKeys={this.state.selectedKeys}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onSelect={this.onSelect}
                onDeselect={this.onDeselect}
                {...otherProps}>
                {menus &&
                    menus.map((item) =>
                        item.sub && item.sub.length ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    )}
            </Menu>
        );
    }
}

export default injectIntl(connect(mapStateToProps)(withRouter(MenuView)));
