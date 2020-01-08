import React, { Component, ReactElement } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { injectIntl, defineMessages, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { logout as logoutAction } from "../actions";
import { IntlProps, ReduxProps, StoreState, Token } from "../type";
import { isAuthorized, isTokenValid, logout } from "../auth";
import { LoginOutlined } from "@ant-design/icons/lib";
import "../style/logout.less";

const messages = defineMessages({
    logoutLoading: {
        id: "app.logging.out",
        defaultMessage: "You are leaving...",
        description: "tip for logout",
    },
    returnToLogin: {
        id: "app.logout.return",
        defaultMessage: "Return to login",
        description: "tip to login",
    },
});

interface Props {
    token: Token;
}

interface State {
    isLogout: boolean;
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        token: state.token,
    } as Props;
};

type LogoutProps = ReduxProps & IntlProps & Props;

class Logout extends Component<LogoutProps, State> {
    constructor(props: LogoutProps) {
        super(props);
        this.state = {
            isLogout: false,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
        return {
            isLogout: !isAuthorized() || !isTokenValid() || nextProps.token.userId === 0,
        };
    }

    componentDidMount(): void {
        if (!this.state.isLogout) {
            const { dispatch } = this.props;
            logout().then(() => {
                dispatch(logoutAction());
                this.setState({ isLogout: true });
            });
        }
    }

    render(): ReactElement {
        const { intl } = this.props;
        if (this.state.isLogout) {
            return (
                <div className="Logout">
                    <Link to="/login">
                        <LoginOutlined />
                        <FormattedMessage {...messages.returnToLogin} />
                    </Link>
                </div>
            );
        } else {
            return (
                <Spin
                    size="large"
                    style={{ width: "100%", height: "100%", paddingTop: "10%" }}
                    tip={intl.formatMessage(messages.logoutLoading)}
                />
            );
        }
    }
}

export const LogoutPage = injectIntl(connect(mapStateToProps)(Logout));
