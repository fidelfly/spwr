import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import * as auth from "./authorize";
import { useDispatch, useSelector } from "react-redux";
import { grantToken, clearToken } from "../actions";
import { StoreState } from "../type";
import { Spin } from "antd";

/*interface Props {
    verifyToken: boolean;
}
type AuthProps = DispatchProp & Props;

interface AuthState {
    verifying: boolean;
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        verifyToken: state.verifyToken,
    };
};

export function withAuthorizeCheck(AuthComp: ComponentType<any>, UnAuthComp: ComponentType<any>): ComponentType<any> {
    const HOCComp = class extends Component<AuthProps, AuthState> {
        constructor(props: AuthProps) {
            super(props);
            this.state = {
                verifying: false,
            };
        }

        static getDerivedStateFromProps(nextProps: AuthProps, prevState: AuthState): AuthState | null {
            if (auth.isAuthorized() && (!auth.isTokenValid() || nextProps.verifyToken)) {
                return {
                    verifying: true,
                };
            }
            return null;
        }

        shouldComponentUpdate(
            nextProps: Readonly<AuthProps>,
            nextState: Readonly<AuthState>,
            nextContext: any
        ): boolean {
            return this.props.verifyToken !== nextProps.verifyToken || this.state.verifying !== nextState.verifying;
        }

        componentDidMount(): void {
            this.refreshAuthorizeStatus();
        }

        async refreshAuthorizeStatus(): Promise<void> {
            if (this.state.verifying) {
                const { dispatch } = this.props;
                try {
                    const tokenData = await auth.refreshToken();
                    dispatch(
                        grantToken({
                            userId: parseInt(tokenData.user_id),
                        })
                    );
                } catch (e) {
                    dispatch(clearToken());
                }

                this.setState({ verifying: false });
            }
        }

        render(): ReactElement {
            if (this.state.verifying) {
                return <Spin size="large" style={{ width: "100%", height: "100%", paddingTop: "10%" }} />;
            }
            const { verifyToken, ...otherProps } = this.props;
            if (auth.isAuthorized() && auth.isTokenValid()) {
                return <AuthComp {...otherProps} />;
            } else {
                return <UnAuthComp {...otherProps} />;
            }
        }
    };

    return connect(mapStateToProps)(HOCComp);
}*/

interface AuthCompProps {
    fallback?: ReactNode;
}

export const AuthComponent: React.FC<AuthCompProps> = (props): ReactElement => {
    const authorized = useSelector<StoreState, boolean>((state) => state.token.userId > 0);
    const [verifying, setVerifying] = useState<boolean>(authorized);
    const dispatch = useDispatch();

    useEffect(() => {
        async function refreshTokenStatus(): Promise<void> {
            try {
                const tokenData = await auth.refreshToken();
                dispatch(
                    grantToken({
                        userId: parseInt(tokenData.user_id),
                    })
                );
            } catch (e) {
                dispatch(clearToken());
            }
        }

        if (auth.isAuthorized() && (!auth.isTokenValid() || !authorized)) {
            setVerifying(true);
            refreshTokenStatus().finally(() => {
                setVerifying(false);
            });
        } else {
            setVerifying(false);
        }
    }, [authorized, dispatch]);

    const conditionView = (authorized: boolean, verifying: boolean): ReactNode => {
        if (authorized) {
            return props.children;
        }
        if (verifying) {
            return "";
        }
        if (props.fallback) {
            return props.fallback;
        }
        return "You are not authorized to access this view";
    };

    return (
        <Spin wrapperClassName={"app-loading"} spinning={verifying}>
            {conditionView(authorized, verifying)}
        </Spin>
    );
};
