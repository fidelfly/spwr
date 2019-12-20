import React, { Component, ComponentType, ReactElement } from "react";
import * as auth from "./authorize";
import { connect, DispatchProp } from "react-redux";
import { grantToken, clearToken } from "../actions";
import { StoreState } from "../type";
import { Spin } from "antd";

interface Props {
    verifyToken: boolean;
}
type AuthProps = DispatchProp & Props;

interface AuthState {
    verifying: boolean;
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        verifyToken: state.verfiyToken,
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

        /*        shouldComponentUpdate(
            nextProps: Readonly<AuthProps>,
            nextState: Readonly<AuthState>,
            nextContext: any
        ): boolean {}*/

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
}
