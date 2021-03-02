import React, { ReactElement, useState } from "react";
import { LockOutlined, UserOutlined, AppleOutlined, WechatOutlined, AlipayCircleOutlined } from "@ant-design/icons";
import { Input, Button, Alert, Form, Row, Col } from "antd";
import { Redirect, useLocation, Link } from "react-router-dom";
import { AuthComponent } from "../auth";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import { appMessages } from "../constants";
import { useDispatch } from "react-redux";
import { grantToken } from "../actions";
import { loginWithPassword } from "../auth";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { AsyncDispatch } from "../type";

import "./login.less";
import PageLayout, { PageForm } from "./template/PageLayout";

const myMessage = defineMessages({
    user: {
        id: "login.user",
        defaultMessage: "User Name",
    },
    userWarning: {
        id: "login.user.warning",
        defaultMessage: "Please input User Name",
    },
    pwdWarning: {
        id: "login.password.warning",
        defaultMessage: "Please input password!",
    },
});

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
        <PageLayout>
            <PageForm className={"login-content"} title={<FormattedMessage {...appMessages.login} />} description={""}>
                <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        name={"username"}
                        rules={[{ required: true, message: intl.formatMessage(myMessage.userWarning) }]}>
                        <Input
                            prefix={<UserOutlined style={{ fontSize: 13 }} />}
                            placeholder={intl.formatMessage(myMessage.user)}
                            onChange={clearError}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"password"}
                        rules={[{ required: true, message: intl.formatMessage(myMessage.pwdWarning) }]}>
                        <Input
                            prefix={<LockOutlined style={{ fontSize: 13 }} />}
                            type="password"
                            placeholder={intl.formatMessage(appMessages.password)}
                            onChange={clearError}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            <FormattedMessage {...appMessages.login} />
                        </Button>
                    </Form.Item>
                    <Link to={"/reg"}>
                        <Button block className={"button-success"}>
                            <FormattedMessage {...appMessages.register} />
                        </Button>
                    </Link>
                    {error && <Alert message={`${error}`} className="login-error" type="error" />}
                </Form>
                <Row className={"oauth-provider"}>
                    <Col span={8}>
                        <Link to={"/login"}>
                            <AppleOutlined />
                        </Link>
                    </Col>

                    <Col span={8}>
                        <Link to={"/login"}>
                            <WechatOutlined />
                        </Link>
                    </Col>
                    <Col span={8}>
                        <Link to={"/login"}>
                            <AlipayCircleOutlined />
                        </Link>
                    </Col>
                </Row>
            </PageForm>
        </PageLayout>
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
