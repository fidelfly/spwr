import React, { ReactElement, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Button, Alert, Form } from "antd";
import { Redirect, useLocation } from "react-router-dom";
import { AuthComponent } from "../auth";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { appMessages } from "../constants";
import { useDispatch } from "react-redux";
import { grantToken } from "../actions";
import { loginWithPassword } from "../auth";
import { Snowflake } from "../icons";
import { LangBtn } from "../components";
import { EnvColor } from "../system";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { AsyncDispatch } from "../type";

import "./login.less";

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
    loginBtn: {
        id: "login.loginBtn",
        defaultMessage: "Login",
        description: "",
    },
});

/*
const FormItem = Form.Item;
const connector = connect();
type Props = WrappedComponentProps<"intl"> & ConnectedProps<typeof connector>;

interface State {
    error?: any;
}

class LoginView extends React.Component<Props, State> {
    form = React.createRef<FormInstance>();
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentWillMount(): void {
        const { intl } = this.props;
        document.title = intl.formatMessage(appMessages.name);
    }

    onFinishFailed = ({ errorFields }: ValidateErrorEntity): void => {
        this.form.current.scrollToField(errorFields[0].name);
    };

    handleSubmit = async (values: any): Promise<boolean> => {
        const { dispatch } = this.props;
        try {
            const token = await requestToken(values);
            dispatch(
                grantToken({
                    userId: parseInt(token.user_id),
                })
            );
        } catch (e) {
            this.setState({ error: e });
        }
        return true;
    };

    clearError = (): void => {
        this.setState({ error: null });
    };

    render(): ReactElement {
        const { intl } = this.props;
        return (
            <div className="loginPage">
                <div className="loginHeader">
                    <LangBtn />
                </div>
                <div className="login">
                    <div className="login-form">
                        <Snowflake style={{ color: EnvColor, fontSize: "80px", marginBottom: "1rem" }} />
                        <div className="login-logo">
                            <span>
                                <FormattedMessage {...appMessages.name} />
                            </span>
                        </div>
                        <Form ref={this.form} onFinish={this.handleSubmit} onFinishFailed={this.onFinishFailed}>
                            <FormItem
                                name={"username"}
                                rules={[{ required: true, message: intl.formatMessage(loginMessage.userWarning) }]}>
                                <Input
                                    prefix={<UserOutlined style={{ fontSize: 13 }} />}
                                    placeholder={intl.formatMessage(loginMessage.user)}
                                    onChange={this.clearError}
                                />
                            </FormItem>
                            <FormItem
                                name={"password"}
                                rules={[{ required: true, message: intl.formatMessage(loginMessage.pwdWarning) }]}>
                                <Input
                                    prefix={<LockOutlined style={{ fontSize: 13 }} />}
                                    type="password"
                                    placeholder={intl.formatMessage(loginMessage.password)}
                                    onChange={this.clearError}
                                />
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    style={{ width: "100%" }}>
                                    <FormattedMessage {...loginMessage.loginBtn} />
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

export const Login = injectIntl(connector(LoginView));


export const LoginPage = withAuthorizeCheck((props: RouteChildrenProps) => {
    const { from } = props.location.state || { from: { pathname: "/app/home" } };
    return <Redirect to={from} />;
}, Login);
*/

export const Login: React.FC = (): ReactElement => {
    const [error, setError] = useState<unknown>(undefined);
    const [form] = Form.useForm();
    const dispatch = useDispatch<AsyncDispatch>();
    const intl = useIntl();
    function onFinishFailed({ errorFields }: ValidateErrorEntity): void {
        form.scrollToField(errorFields[0].name);
    }

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        try {
            const token = await loginWithPassword(values);
            dispatch(
                grantToken({
                    userId: parseInt(token.user_id),
                })
            );
        } catch (e) {
            setError(e);
        }
        return true;
    }

    function clearError(): void {
        setError(null);
    }

    return (
        <div className="loginPage">
            <div className="loginHeader">
                <LangBtn />
            </div>
            <div className="login">
                <div className="login-form">
                    <Snowflake style={{ color: EnvColor, fontSize: "80px", marginBottom: "1rem" }} />
                    <div className="login-logo">
                        <span>
                            <FormattedMessage {...appMessages.name} />
                        </span>
                    </div>
                    <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
                        <Form.Item
                            name={"username"}
                            rules={[{ required: true, message: intl.formatMessage(loginMessage.userWarning) }]}>
                            <Input
                                prefix={<UserOutlined style={{ fontSize: 13 }} />}
                                placeholder={intl.formatMessage(loginMessage.user)}
                                onChange={clearError}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"password"}
                            rules={[{ required: true, message: intl.formatMessage(loginMessage.pwdWarning) }]}>
                            <Input
                                prefix={<LockOutlined style={{ fontSize: 13 }} />}
                                type="password"
                                placeholder={intl.formatMessage(loginMessage.password)}
                                onChange={clearError}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                style={{ width: "100%" }}>
                                <FormattedMessage {...loginMessage.loginBtn} />
                            </Button>
                        </Form.Item>
                    </Form>
                    {error && <Alert message={`${error}`} className="login-error" type="error" />}
                </div>
            </div>
            <div className="loginFooter">
                <div className="copyright">
                    <FormattedMessage {...appMessages.copyright} />
                </div>
            </div>
        </div>
    );
};

export const LoginPage: React.FC = (): ReactElement => {
    const location = useLocation();
    const { from } = (location.state as { from: { pathname: string } }) || { from: { pathname: "/app/home" } };
    return (
        <AuthComponent fallback={<Login />}>
            <Redirect to={from} push={true} />
        </AuthComponent>
    );
};
