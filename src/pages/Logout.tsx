import React, { ReactElement, useEffect, useState } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../actions";
import { AsyncDispatch, StoreState } from "../type";
import { isAuthorized, isTokenValid, logout } from "../auth";
import { LoginOutlined } from "@ant-design/icons/lib";
import "./logout.less";

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
/*
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
*/
export const LogoutPage: React.FC = (): ReactElement => {
    const [isLogout, setLogout] = useState<boolean>(!isAuthorized() || isTokenValid());
    const intl = useIntl();
    const userId = useSelector<StoreState, number>((state) => state.token.userId);
    const dispatch = useDispatch<AsyncDispatch>();
    useEffect(() => {
        if (userId > 0 || (isAuthorized() && isTokenValid())) {
            logout().then(() => {
                dispatch(logoutAction());
                setLogout(true);
            });
        }
    }, [dispatch, userId]);

    if (isLogout) {
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
};
