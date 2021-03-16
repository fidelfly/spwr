import React, { ReactElement, useState, useEffect, MouseEvent } from "react";
import ViewLayout, { ViewHeader, ViewContent } from "../template/ViewLayout";
import { BreadcrumbRoute, PathBreadcrumb } from "../../components/PathBreadcrumb";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { appMessages, WsPath } from "../../constants";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import { Button, Descriptions, Form, Image, Upload, Input, Space, Modal } from "antd";
import { CaretRightOutlined, ArrowLeftOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { StoreState, User } from "../../type";
import { Ajax, AjaxCfg, AjaxKit } from "../../ajax";
import { useMessage, useValidateRules } from "../../utilities";
import { RcFile } from "antd/es/upload";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { updateUser, viewLoading } from "../../actions";
import ImgCrop from "antd-img-crop";
import { PwdHint } from "../../components";

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
    const [avatarFile, setAvatar] = useState<RcFile | null>(null);
    const [previewUrl, setPreview] = useState<string | null>(null);
    const [avatarID, setAvatarID] = useState<number>(user.avatar || 0);

    useEffect(() => {
        if (avatarFile != null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(avatarFile);
        } else {
            setPreview(() => {
                if (avatarID > 0) {
                    return AjaxKit.getPath(WsPath.avatar.get, { key: avatarID }, true);
                }
                return null;
            });
        }
    }, [avatarFile, avatarID]);

    function removeAvatar(e: MouseEvent): void {
        setAvatarID(0);
        setAvatar(null);
        e.stopPropagation();
    }

    async function uploadAvatar(): Promise<number> {
        if (avatarFile == null) {
            return 0;
        }
        const formData = new FormData();
        formData.append("file", avatarFile as RcFile);
        try {
            const resp = await Ajax.post<{ key: string }>(WsPath.avatar.upload, formData);
            setAvatar(null);
            const id = parseInt(resp.data.key);
            setAvatarID(id);
            return id;
        } catch (e) {
            msgHandler.showNotification({
                code: "avatar.upload.error",
                message: "Upload avatar failed!",
                type: "error",
            });
        }

        return 0;
    }

    function onFinishFailed({ errorFields }: ValidateErrorEntity): void {
        form.scrollToField(errorFields[0].name);
    }

    function save() {
        form.submit();
    }

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        dispatch(viewLoading(true));
        if (avatarFile != null) {
            const avatar = await uploadAvatar();
            if (avatar === 0) {
                dispatch(viewLoading(false));
                return false;
            }
            setAvatarID(avatar);
            values["avatar"] = avatar;
        } else {
            if (values["avatar"] == null) {
                values["avatar"] = avatarID;
            }
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
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

        if (!isJpgOrPng) {
            msgHandler.showMessage({
                code: "upload.file.image.type.warning",
                message: "You can only upload JPG/PNG file!",
                type: "error",
            });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            msgHandler.showMessage({
                code: "upload.file.size.warning",
                message: "Image must smaller than 2MB!",
                type: "error",
            });
        }
        if (isJpgOrPng && isLt2M) {
            setAvatar(file);
        }
        return false;
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
                <Form.Item label={<FormattedMessage {...appMessages.avatar} />}>
                    <ImgCrop
                        grid
                        rotate
                        modalTitle={intl.formatMessage(appMessages.edit)}
                        modalOk={intl.formatMessage(appMessages.confirm)}
                        modalCancel={intl.formatMessage(appMessages.cancel)}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            fileList={avatarFile != null ? [avatarFile] : []}
                            beforeUpload={beforeUpload}>
                            {previewUrl == null ? (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>
                                        <FormattedMessage {...appMessages.upload} />
                                    </div>
                                </div>
                            ) : (
                                <div className={"avatar-uploader"}>
                                    <Image alt="avatar" src={previewUrl} width={100} height={100} preview={false} />
                                    <Button type={"default"} onClick={removeAvatar}>
                                        <FormattedMessage {...appMessages.remove} />
                                    </Button>
                                </div>
                            )}
                        </Upload>
                    </ImgCrop>
                </Form.Item>

                <Form.Item label={intl.formatMessage(appMessages.userName)} name={"name"} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </ViewContent>
    );
};
