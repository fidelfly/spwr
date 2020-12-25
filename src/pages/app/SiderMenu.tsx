import React, { ReactElement, useState } from "react";
import { Theme } from "../../type";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { MenuItem, menus } from "./menus";
import { Path } from "../../utilities";
import { Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import { SelectInfo } from "rc-menu/lib/interface";

interface Props extends MenuProps {
    theme: Theme;
    collapsed: boolean;
}

/*
interface State {
    path?: string;
    selectedKeys: string[];
    openKeys: string[];
}

type MenuViewProps = IntlProps & RouteComponentProps & Props & any;

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
                    {item.icon}
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
                        {item.icon}
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
        const { collapsed, theme, style, className } = this.props;
        return (
            <Menu
                mode={collapsed ? "vertical" : "inline"}
                theme={theme}
                selectedKeys={this.state.selectedKeys}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onSelect={this.onSelect}
                onDeselect={this.onDeselect}
                className={className}
                style={style}>
                {menus &&
                    menus.map((item) =>
                        item.sub && item.sub.length ? this.renderSubMenu(item) : this.renderMenuItem(item)
                    )}
            </Menu>
        );
    }
}

export default injectIntl(withRouter(MenuView));
*/

export const SiderMenu: React.FC<Props> = (props) => {
    const location = useLocation();
    const [path, setPath] = useState<string>("");
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const { collapsed, ...otherProps } = props;
    const newPath = location.pathname;
    if (newPath !== path) {
        if (collapsed) {
            setOpenKeys([]);
        } else {
            const parentPath = Path.getParent(newPath);
            if (parentPath !== newPath) {
                if (openKeys.indexOf(parentPath) < 0) {
                    setOpenKeys([...openKeys, parentPath]);
                }
            }
        }
        setSelectedKeys([newPath]);
        setPath(newPath);
    }

    function renderMenuItem(item: MenuItem): ReactElement {
        return (
            <Menu.Item key={item.key} {...item.props}>
                <Link to={item.key}>
                    {item.icon}
                    <span>
                        <FormattedMessage id={item.title} defaultMessage={item.title} />
                    </span>
                </Link>
            </Menu.Item>
        );
    }

    function renderSubMenu(item: MenuItem): ReactElement {
        return (
            <Menu.SubMenu
                key={item.key}
                title={
                    <span>
                        {item.icon}
                        <span>
                            <FormattedMessage id={item.title} defaultMessage={item.title} />
                        </span>
                    </span>
                }
                {...item.props}>
                {item.sub && item.sub.map((item) => renderMenuItem(item))}
            </Menu.SubMenu>
        );
    }

    function onSelectChange(param: SelectInfo): void {
        setSelectedKeys(param.selectedKeys as string[]);
    }

    function onOpenChange(param: (string | number)[]): void {
        setOpenKeys(param as string[]);
    }

    return (
        <Menu
            mode={collapsed ? "vertical" : "inline"}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelectChange}
            onDeselect={onSelectChange}
            {...otherProps}>
            {menus && menus.map((item) => (item.sub && item.sub.length ? renderSubMenu(item) : renderMenuItem(item)))}
        </Menu>
    );
};
