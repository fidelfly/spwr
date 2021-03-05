import React, { ReactElement, MouseEvent, useEffect, useMemo, useState } from "react";
import { Input, Row, Col, Image, Form, Upload, Select, Checkbox, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { appMessages, WsPath } from "../../constants";
import { RcFile } from "antd/lib/upload/interface";
import { useMessage, TZData, Timezone, useValidateRules } from "../../utilities";
import { PlusOutlined } from "@ant-design/icons";
import { BackButton, PwdHint, SubscribeADHint, TermHint } from "../../components";
import { PageForm } from "../template/PageLayout";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { Ajax, AjaxCfg, AjaxKit } from "../../ajax";

export const RegisterByEmail: React.FC = (): ReactElement => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const msgHandler = useMessage();
    const validateRules = useValidateRules();

    const timezoneOptions = useMemo(() => {
        return TZData.map((zone: Timezone) => {
            return {
                value: zone.code,
                label: `${zone.code} (${zone.offset})`,
            };
        });
    }, []);

    const [avatarFile, setAvatar] = useState<RcFile | null>(null);
    const [previewUrl, setPreview] = useState<string | null>(null);
    const [avatarID, setAvatarID] = useState<number>(0);

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
                    return AjaxKit.getPath(WsPath.avatar.get, { id: avatarID }, true);
                }
                return null;
            });
        }
    }, [avatarFile, avatarID]);

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
            const resp = await axios.post<{ id: number }>(AjaxKit.getPath(WsPath.avatar.upload, null, true), formData);
            setAvatar(null);
            setAvatarID(resp.data.id);
            return resp.data.id;
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

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        if (avatarFile != null) {
            const avatar = await uploadAvatar();
            if (avatar === 0) {
                return false;
            }
            values["avatar"] = avatar;
        }
        const ajaxConfig = {
            ...AjaxCfg.FormRequestConfig,
            withAuthInject: false,
        };

        try {
            await Ajax.post(AjaxKit.getPath(WsPath.user), values, ajaxConfig);
            msgHandler.showMessage({
                code: "register.success",
                message: "Register success",
                type: "success",
            });
        } catch (e) {
            msgHandler.showMessage({
                code: "register.failed",
                message: "Register failed",
                type: "error",
            });
            return false;
        }

        return true;
    }

    return (
        <PageForm className={"reg-email"} title={"Register by email"} description={""}>
            <Form
                form={form}
                className={"form-block form-without-warning"}
                layout={"vertical"}
                style={{ width: 500 }}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}>
                <Form.Item label={intl.formatMessage(appMessages.userName)} name={"name"} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label={intl.formatMessage(appMessages.email)}
                    name={"email"}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                        { required: true },
                        { type: "email" },
                        validateRules.unique("usermail", "validate.unique.usermail", { validateTrigger: "onBlur" }),
                    ]}>
                    <Input />
                </Form.Item>
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
                <Form.Item
                    label={<FormattedMessage {...appMessages.timeZone} />}
                    name={"timezone"}
                    initialValue={"Asia/Hong_Kong"}>
                    <Select options={timezoneOptions} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage(appMessages.password)}
                    name={"password"}
                    rules={[{ required: true }]}>
                    <Input type="password" />
                </Form.Item>
                <PwdHint />
                <Form.Item name={"subscribe"} initialValue={true} valuePropName={"checked"}>
                    <Checkbox>
                        <SubscribeADHint />
                    </Checkbox>
                </Form.Item>
                <Form.Item name={"term"} initialValue={true} valuePropName={"checked"}>
                    <Checkbox>
                        <TermHint />
                    </Checkbox>
                </Form.Item>
                <Row gutter={20}>
                    <Col offset={14} span={5}>
                        <BackButton block>
                            <FormattedMessage {...appMessages.back} />
                        </BackButton>
                    </Col>
                    <Col span={5}>
                        <Button block type="primary" htmlType="submit">
                            <FormattedMessage {...appMessages.confirm} />
                        </Button>
                    </Col>
                </Row>
            </Form>
        </PageForm>
    );
};
