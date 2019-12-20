import React, { ReactElement } from "react";
import { Form, Icon, Input, Button, Alert } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { Redirect } from "react-router-dom";
import { withAuthorizeCheck } from "../auth";
import { injectIntl, FormattedMessage, defineMessages, WrappedComponentProps } from "react-intl";
import { appMessages } from "../constants";
import { connect, ConnectedProps } from "react-redux";
// import { findErrorMessage } from "../errors";
import { grantToken } from "../actions";
import { requestToken } from "../auth";
import { AppIcon } from "../icons";
import { LangBtn } from "../components";
import { EnvColor } from "../system";

import "../style/login.less";

const loginMessage = defineMessages({
    user: {
        id: "login.user",
        defaultMessage: "User Name",
        description: "Placeholder for user name input",
    },
    userWarning: {
        id: "login.user.warning",
        defaultMessage: "Please input User Name",
        description: "",
    },
    password: {
        id: "login.pwd",
        defaultMessage: "Password",
        description: "Placeholder for password input",
    },
    pwdWarning: {
        id: "login.pwd.warning",
        defaultMessage: "Please input password!",
        description: "",
    },
});

const FormItem = Form.Item;
const connector = connect();
type Props = WrappedComponentProps<"intl"> &
    ConnectedProps<typeof connector> &
    FormComponentProps & {
        language: string;
    };

interface State {
    error?: any;
}

class LoginView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentWillMount(): void {
        const { intl } = this.props;
        document.title = intl.formatMessage(appMessages.name);
    }

    handleSubmit = (e: any): void => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    const token = await requestToken(values);
                    dispatch(
                        grantToken({
                            userId: parseInt(token.user_id),
                        })
                    );
                } catch (e) {
                    this.setState({ error: err });
                }
            }
        });
    };

    clearError = (): void => {
        this.setState({ error: null });
    };

    render(): ReactElement {
        const { intl } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="loginPage">
                <div className="loginHeader">
                    <LangBtn />
                </div>
                <div className="login">
                    <div className="login-form">
                        <AppIcon style={{ color: EnvColor, fontSize: "80px", marginBottom: "1rem" }} />
                        <div className="login-logo">
                            <span>
                                <FormattedMessage {...appMessages.name} />
                            </span>
                        </div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator("username", {
                                    rules: [{ required: true, message: intl.formatMessage(loginMessage.userWarning) }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                        placeholder={intl.formatMessage(loginMessage.user)}
                                        onChange={this.clearError}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("password", {
                                    rules: [{ required: true, message: intl.formatMessage(loginMessage.pwdWarning) }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                        type="password"
                                        placeholder={intl.formatMessage(loginMessage.password)}
                                        onChange={this.clearError}
                                    />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    style={{ width: "100%" }}>
                                    <FormattedMessage id={"login.loginBtn"} defaultMessage={"Login"} />
                                </Button>
                            </FormItem>
                        </Form>
                        {this.state.error && <Alert message={this.state.error} className="login-error" type="error" />}
                    </div>
                </div>
                <div className="loginFooter">
                    <div className="copyright">
                        <FormattedMessage {...appMessages.copyright} />
                    </div>
                </div>
            </div>
        );
    }
}

export const Login = injectIntl(Form.create()(connector(LoginView)));

export const LoginPage = withAuthorizeCheck((props: { location: { state?: any } }) => {
    const { from } = props.location.state || { from: { pathname: "/app/home" } };
    return <Redirect to={from} />;
}, Login);
