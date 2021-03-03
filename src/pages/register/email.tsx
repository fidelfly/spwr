import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Input, Row, Col, Form, Upload, Select, Checkbox, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { appMessages, WsPath } from "../../constants";
import { RcFile } from "antd/lib/upload/interface";
import { useMessage, TZData, Timezone } from "../../utilities";
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

    const timezoneOptions = useMemo(() => {
        return TZData.map((zone: Timezone) => {
            return {
                value: zone.code,
                label: `${zone.code} (${zone.offset})`,
            };
        });
    }, []);

    const [logoFile, setLogo] = useState<RcFile | null>(null);

    const [previewUrl, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (logoFile != null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(logoFile);
        } else {
            setPreview((url) => {
                if (url != null && url.startsWith("data:image")) {
                    return null;
                }
                return url;
            });
        }
    }, [logoFile]);

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
            setLogo(file);
        }
        return false;
    }

    async function uploadAvatar(): Promise<number> {
        if (logoFile == null) {
            return 0;
        }
        const formData = new FormData();
        formData.append("file", logoFile as RcFile);
        try {
            const resp = await axios.post<{ id: number }>(AjaxKit.getPath(WsPath.avatar.upload, null, true), formData);
            setLogo(null);
            setPreview(AjaxKit.getPath(WsPath.avatar.get, { id: resp.data.id }, true));
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
        if (logoFile != null) {
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
                <Form.Item
                    label={<FormattedMessage {...appMessages.userName} />}
                    name={"name"}
                    rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label={<FormattedMessage {...appMessages.email} />}
                    name={"email"}
                    rules={[{ required: true }]}>
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
                            beforeUpload={beforeUpload}>
                            {previewUrl == null ? (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            ) : (
                                <img alt="avatar" src={previewUrl} width={100} height={100} />
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
                    label={<FormattedMessage {...appMessages.password} />}
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
