import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { LangBtn } from "../../components";
import { appMessages } from "../../constants";
import "../style/PageLayout.less";
import { EnvColor } from "../../system";
import { Snowflake } from "../../icons";
import { GithubOutlined } from "@ant-design/icons";
// import background from "../../assets/image/login_bg.png";
import { Typography } from "antd";
const { Title, Paragraph, Text, Link } = Typography;
type Props = React.HTMLAttributes<HTMLDivElement>;

export const PageLayout: React.FC<Props> = (props: Props): ReactElement => {
    const { className, children, ...others } = props;

    return (
        <div className={`${className || ""} page`} {...others}>
            <div className="page-header">
                <LangBtn />
            </div>
            <div className="page-content-block">
                <div className="page-content">
                    <Typography className="app-introduction">
                        <Paragraph className={"page-logo"}>
                            <Snowflake className={"logo"} />
                            <Title>
                                <FormattedMessage {...appMessages.name} />
                            </Title>
                        </Paragraph>
                        <Paragraph className={"app-link"}>
                            <Link href={"https://github.com/fidelfly/spwr"} type={"secondary"} className={"github"}>
                                <GithubOutlined />
                                <FormattedMessage
                                    id={"app.project.url"}
                                    defaultMessage={"Go to project's repository"}
                                />
                            </Link>
                        </Paragraph>
                    </Typography>
                    <div className="page-custom">{children}</div>
                </div>
                <div className="page-footer">
                    <div className="copyright">
                        <FormattedMessage {...appMessages.copyright} />
                    </div>
                </div>
            </div>
        </div>
    );
};

type FormProps = {
    title: ReactNode;
    description: ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export const PageForm: React.FC<FormProps> = (props: FormProps): ReactElement => {
    const { className, title, description, children, ...others } = props;
    return (
        <div className={`${className || ""} content-form`} {...others}>
            {(title || description) && (
                <div className="content-title">
                    {title && <h1>{title}</h1>}
                    {description && <p>{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
};

export default PageLayout;
