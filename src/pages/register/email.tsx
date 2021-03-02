import React, { ReactElement, useMemo, useState } from "react";
import { Input, Row, Col, Form, Upload, Select, Checkbox, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { appMessages } from "../../constants";
import { RcFile } from "antd/lib/upload/interface";
import { useMessage, TZData, Timezone } from "../../utilities";
import { PlusOutlined } from "@ant-design/icons";
import { BackButton, PwdHint, SubscribeADHint, TermHint } from "../../components";
import { PageForm } from "../template/PageLayout";

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

    return (
        <PageForm className={"reg-email"} title={"Register by email"} description={""}>
            <Form form={form} className={"form-block form-without-warning"} layout={"vertical"} style={{ width: 500 }}>
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
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}>
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
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
