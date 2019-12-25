import React, { Component, ReactElement } from "react";
import { Menu, Avatar, Icon } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { IntlProps, ReduxProps, StoreState, User } from "../../type";
import { LangBtn } from "../../components";
import { WsPath, appMessages } from "../../constants";
import { AjaxKit } from "../../ajax";
import { connect } from "react-redux";

interface Props {
    user: User;
}

type HeaderProps = ReduxProps & IntlProps & Props;

const mapStateToProps = (state: StoreState): Props => {
    return {
        user: state.user,
    } as Props;
};

class HeaderView extends Component<HeaderProps, any> {
    render(): ReactElement {
        return (
            <Menu mode={"horizontal"} className={"App-Header-Menu"} selectable={false}>
                <Menu.Item>
                    <LangBtn />
                </Menu.Item>
                <Menu.SubMenu
                    title={
                        <span>
                            {this.props.user.avatar > 0 ? (
                                <Avatar
                                    className={"Avatar"}
                                    src={AjaxKit.getPath(WsPath.file, this.props.user.avatar)}
                                />
                            ) : (
                                <Avatar className={"Avatar"} icon={"user"} />
                            )}
                            <span className={"Avatar-Name"}>{this.props.user.name}</span>
                        </span>
                    }>
                    <Menu.Item key={"logout"}>
                        <Link to={"/logout"}>
                            <Icon type={"logout"} />
                            <span>
                                <FormattedMessage {...appMessages.logout} />
                            </span>
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );
    }
}

export const Header = injectIntl(connect(mapStateToProps)(HeaderView));
