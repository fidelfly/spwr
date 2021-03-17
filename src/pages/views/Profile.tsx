import React, { ReactElement, useState } from "react";
import ViewLayout, { ViewHeader, ViewContent } from "../template/ViewLayout";
import { BreadcrumbRoute, PathBreadcrumb } from "../../components/PathBreadcrumb";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { appMessages, WsPath } from "../../constants";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { Button, Descriptions, Form, Image, Input, Space, Modal } from "antd";
import { CaretRightOutlined, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { StoreState, User } from "../../type";
import { Ajax, AjaxCfg, AjaxKit } from "../../ajax";
import { useMessage, useValidateRules } from "../../utilities";
import { RcFile } from "antd/es/upload";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { updateUser, viewLoading } from "../../actions";
import { PwdHint, useImageValue, ImageValue } from "../../components";

const viewMessage = defineMessages({
    title: {
        id: "menu.account.profile",
        defaultMessage: "Profile",
    },
    chgPwd: {
        id: "profile.change.pwd",
        defaultMessage: "Change Password",
    },
    oldPwd: {
        id: "profile.original.pwd",
        defaultMessage: "Original Password",
    },
});

const myRoutes: BreadcrumbRoute = {
    path: "/",
    title: <FormattedMessage {...viewMessage.title} />,
    children: [
        {
            path: "/e",
            title: <FormattedMessage {...appMessages.edit} />,
        },
    ],
};

export const Profile: React.FC = (): ReactElement => {
    return (
        <ViewLayout>
            <PathBreadcrumb
                base="/app/account/profile"
                routes={myRoutes}
                className={"view-breadcrumb"}
                separator={<CaretRightOutlined />}
            />
            <Switch>
                <Route exact path={"/app/account/profile/e"} component={ProfileEditor} />
                <Route>
                    <ProfileView />
                </Route>
            </Switch>
        </ViewLayout>
    );
};

const ProfileView: React.FC = (): ReactElement => {
    const user = useSelector<StoreState, User>((state) => state.user as User);
    const [showPwdEditor, setShowPwdEditor] = useState<boolean>(false);
    const [disableForm, setFormDisable] = useState<boolean>(false);
    const [form] = Form.useForm();
    const msgHandler = useMessage();
    const validateRules = useValidateRules();
    function onFinishFailed({ errorFields }: ValidateErrorEntity): void {
        form.scrollToField(errorFields[0].name);
    }

    function onPwdChange() {
        form.submit();
    }

    function onPwdCancel() {
        setShowPwdEditor(false);
        form.resetFields();
    }

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        setFormDisable(true);
        const ajaxConfig = {
            ...AjaxCfg.FormRequestConfig,
        };

        try {
            await Ajax.post(
                AjaxKit.getPath(WsPath.password, { id: user.id }),
                { id: user.id, password: values["password"] },
                ajaxConfig
            );
            msgHandler.showMessage({
                code: appMessages.updateSuccess.id,
                message: appMessages.updateSuccess.defaultMessage,
                type: "success",
            });
            setShowPwdEditor(false);
            setFormDisable(false);
            form.resetFields();
        } catch (e) {
            setFormDisable(false);
            msgHandler.showMessage({
                code: appMessages.updateFailed.id,
                message: appMessages.updateFailed.defaultMessage,
                type: "error",
            });
            return false;
        }
        return true;
    }
    return (
        <ViewContent>
            <ViewHeader
                toolbar={
                    <Space>
                        <Button
                            type={"primary"}
                            onClick={() => {
                                setShowPwdEditor(true);
                            }}>
                            <FormattedMessage {...viewMessage.chgPwd} />
                        </Button>
                        <Link to={"/app/account/profile/e"} key={"edit"}>
                            <Button type={"primary"}>
                                <FormattedMessage {...appMessages.edit} />
                            </Button>
                        </Link>
                    </Space>
                }
            />
            <Descriptions bordered column={1} labelStyle={{ width: 150 }}>
                <Descriptions.Item label={<FormattedMessage {...appMessages.avatar} />}>
                    {user.avatar != null && user.avatar > 0 ? (
                        <Image width={100} src={AjaxKit.getPath(WsPath.avatar.get, { key: user.avatar }, true)} />
                    ) : (
                        <UserOutlined style={{ fontSize: 100 }} />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage {...appMessages.userName} />}>
                    {user.name}
                </Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage {...appMessages.email} />}>
                    {user.email || ""}
                </Descriptions.Item>
                <Descriptions.Item label={<FormattedMessage {...appMessages.phone} />}>
                    {user.phone || ""}
                </Descriptions.Item>
            </Descriptions>
            <Modal
                title={<FormattedMessage {...viewMessage.chgPwd} />}
                visible={showPwdEditor}
                okButtonProps={{ loading: disableForm }}
                cancelButtonProps={{ disabled: disableForm }}
                onOk={onPwdChange}
                onCancel={onPwdCancel}>
                <Form
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label={<FormattedMessage {...viewMessage.oldPwd} />}
                        name={"org_password"}
                        validateTrigger={["onBlur", "onChange"]}
                        rules={[
                            { required: true },
                            validateRules.password(user.id, appMessages.invalidPwd, { validateTrigger: "onBlur" }),
                        ]}>
                        <Input type="password" disabled={disableForm} />
                    </Form.Item>
                    <Form.Item
                        label={<FormattedMessage {...appMessages.password} />}
                        name={"password"}
                        rules={[{ required: true }]}>
                        <Input type="password" disabled={disableForm} />
                    </Form.Item>
                    <PwdHint />
                </Form>
            </Modal>
        </ViewContent>
    );
};

const ProfileEditor: React.FC = (): ReactElement => {
    const [form] = Form.useForm<{ avatar: number; first_name: string; last_name: string }>();
    const user = useSelector<StoreState, User>((state) => state.user as User);
    const intl = useIntl();
    const msgHandler = useMessage();
    const dispatch = useDispatch();
    const history = useHistory();
    const avatarRef = useImageValue<number>();

    function onFinishFailed({ errorFields }: ValidateErrorEntity): void {
        form.scrollToField(errorFields[0].name);
    }

    function save() {
        form.submit();
    }

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        dispatch(viewLoading(true));
        try {
            [values["avatar"]] = await Promise.all([avatarRef.current.upload()]);
        } catch (e) {
            dispatch(viewLoading(false));
            return false;
        }

        const ajaxConfig = {
            ...AjaxCfg.FormRequestConfig,
        };

        try {
            await Ajax.post(AjaxKit.getPath(WsPath.user, { id: user.id }), values, ajaxConfig);
            msgHandler.showMessage({
                code: appMessages.saveSuccess.id,
                message: appMessages.saveSuccess.defaultMessage,
                type: "success",
            });
            dispatch(viewLoading(false));
            const newUser = { ...user, ...values };
            dispatch(updateUser(newUser));
            history.push({ pathname: "/app/account/profile" });
        } catch (e) {
            dispatch(viewLoading(false));
            msgHandler.showMessage({
                code: appMessages.saveFailed.id,
                message: appMessages.saveFailed.defaultMessage,
                type: "error",
            });
            return false;
        }

        return true;
    }

    function beforeUpload(file: RcFile) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            msgHandler.showMessage({
                code: "upload.file.size.warning",
                message: "Image must smaller than 2MB!",
                type: "error",
            });
        }

        return isLt2M;
    }

    return (
        <ViewContent style={{ textAlign: "center" }}>
            <ViewHeader
                toolbar={[
                    <Button type={"primary"} key={"save"} onClick={save}>
                        <FormattedMessage {...appMessages.save} />
                    </Button>,
                ]}
                backIcon={
                    <Link to={"/app/account/profile"}>
                        <ArrowLeftOutlined />
                    </Link>
                }
                onBack={() => null}
            />
            <Form
                form={form}
                className={"form-without-warning"}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ width: 700, display: "inline-block", textAlign: "left" }}
                initialValues={{
                    name: user.name,
                    avatar: user.avatar,
                }}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}>
                <Form.Item name={"avatar"} label={<FormattedMessage {...appMessages.avatar} />}>
                    <ImageValue
                        ref={avatarRef}
                        disableAutoUpload
                        action={WsPath.avatar.upload}
                        accept={"image/jpeg,image/png"}
                        imgURL={(value) =>
                            (value as number) > 0 ? AjaxKit.getPath(WsPath.avatar.get, { key: value }, true) : null
                        }
                        transform={(key) => parseInt(key)}
                        beforeUpload={beforeUpload}
                        crop={{
                            grid: true,
                            rotate: true,
                            modalTitle: intl.formatMessage(appMessages.edit),
                            modalOk: intl.formatMessage(appMessages.confirm),
                            modalCancel: intl.formatMessage(appMessages.cancel),
                        }}
                        preview={{
                            uploadText: intl.formatMessage(appMessages.upload),
                            removeText: intl.formatMessage(appMessages.remove),
                            size: { width: 100, height: 100 },
                            className: "avatar-uploader",
                        }}
                    />
                </Form.Item>

                <Form.Item label={intl.formatMessage(appMessages.userName)} name={"name"} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </ViewContent>
    );
};
