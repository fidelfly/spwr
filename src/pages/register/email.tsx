import React, { ReactElement, useMemo, useState } from "react";
import { Input, Row, Col, Form, Select, Checkbox, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { appMessages, WsPath } from "../../constants";
import { RcFile } from "antd/lib/upload/interface";
import { useMessage, TZData, Timezone, useValidateRules } from "../../utilities";
import { BackButton, ImageValue, PwdHint, SubscribeADHint, TermHint, useImageValue } from "../../components";
import { PageForm } from "../template/PageLayout";
import { Link } from "react-router-dom";
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

    const [done, setDone] = useState<boolean>(false);
    const avatarRef = useImageValue<number>();

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

    function resetForm(): void {
        form.resetFields();
        setDone(false);
    }

    function onFinishFailed({ errorFields }: ValidateErrorEntity): void {
        form.scrollToField(errorFields[0].name);
    }

    async function handleSubmit(values: Record<string, unknown>): Promise<boolean> {
        try {
            [values["avatar"]] = await Promise.all([avatarRef.current.upload()]);
        } catch (e) {
            return false;
        }

        const ajaxConfig = {
            ...AjaxCfg.FormRequestConfig,
        };

        try {
            await Ajax.post(AjaxKit.getPath(WsPath.user), values, ajaxConfig);
            msgHandler.showMessage({
                code: "register.success",
                message: "Register success",
                type: "success",
            });
            setDone(true);
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
            {done ? (
                <div style={{ width: 500 }}>
                    <p>
                        <FormattedMessage id={"reg.email.done"} defaultMessage={"Registration Done!"} />
                    </p>
                    <p>
                        <Link to={"/login"}>
                            <FormattedMessage id={"app.back.login"} defaultMessage={"Back to login"} />
                        </Link>
                    </p>
                    <p>
                        <Button type={"link"} onClick={resetForm} style={{ paddingLeft: 0 }}>
                            <FormattedMessage id={"reg.email.reset"} defaultMessage={"Create another account"} />
                        </Button>
                    </p>
                </div>
            ) : (
                <Form
                    form={form}
                    className={"form-block form-without-warning"}
                    layout={"vertical"}
                    style={{ width: 500 }}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label={intl.formatMessage(appMessages.userName)}
                        name={"name"}
                        rules={[{ required: true }]}>
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
                    <Form.Item
                        name={"term"}
                        initialValue={true}
                        valuePropName={"checked"}
                        rules={[
                            validateRules.checked({ id: "reg.term.must", defaultMessage: "You must agree with terms" }),
                        ]}>
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
            )}
        </PageForm>
    );
};
