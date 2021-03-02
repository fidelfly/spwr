import { Typography, Button } from "antd";
import { FormattedMessage } from "react-intl";
import { TypographyProps } from "antd/lib/typography/Typography";
import React, { ReactElement, useMemo } from "react";
import { ButtonProps } from "antd/lib/button/button";
import { useLocation } from "react-router";
import { Link as RouteLink } from "react-router-dom";
const { Text, Link, Paragraph } = Typography;

export const TermHint: React.FC<TypographyProps> = (props: TypographyProps): ReactElement => {
    const { style, ...others } = props;
    return (
        <Typography {...others} style={{ ...style, display: "inline" }}>
            <Text>
                <FormattedMessage
                    id={"fragment.term.1"}
                    defaultMessage={"I acknowledge that I agree to the "}></FormattedMessage>
                <Link underline>
                    <FormattedMessage id={"fragment.term.2"} defaultMessage={"Terms of Use"} />
                </Link>
                <FormattedMessage id={"fragment.term.3"} defaultMessage={" and have read the "}></FormattedMessage>
                <Link underline>
                    <FormattedMessage id={"fragment.term.4"} defaultMessage={"Privacy Policy"} />
                </Link>
            </Text>
        </Typography>
    );
};

export const SubscribeADHint: React.FC<TypographyProps> = (props: TypographyProps): ReactElement => {
    const { style, ...others } = props;
    return (
        <Typography {...others} style={{ ...style, display: "inline" }}>
            <Text>
                <FormattedMessage
                    id={"fragment.ad.subscribe"}
                    defaultMessage={
                        "I want to receive news, feature, update, discounts and offers from SPWR"
                    }></FormattedMessage>
            </Text>
        </Typography>
    );
};

type BackButtonProps = ButtonProps & React.RefAttributes<HTMLElement>;
export const BackButton: React.FC<BackButtonProps> = (props): ReactElement => {
    const location = useLocation();
    const backTo = useMemo(() => {
        let path = location.pathname.split("/");
        path = path.slice(0, path.length - 1);
        return path.join("/");
    }, [location]);

    return (
        <RouteLink to={backTo}>
            <Button {...props} />
        </RouteLink>
    );
};

export const PwdHint: React.FC = (): ReactElement => {
    return (
        <>
            <Typography>
                <Text strong>
                    <FormattedMessage id={"fragment.pwd.hint.0"} defaultMessage={"Password should include:"} />
                </Text>
                <Paragraph>
                    <ul>
                        <li>
                            <Text type={"secondary"}>
                                <FormattedMessage id={"fragment.pwd.hint.1"} defaultMessage={"at least 8 characters"} />
                            </Text>
                        </li>
                        <li>
                            <Text type={"secondary"}>
                                <FormattedMessage id={"fragment.pwd.hint.2"} defaultMessage={"at least 1 alphabet"} />
                            </Text>
                        </li>
                        <li>
                            <Text type={"secondary"}>
                                <FormattedMessage id={"fragment.pwd.hint.3"} defaultMessage={"at least 1 number"} />
                            </Text>
                        </li>
                    </ul>
                </Paragraph>
            </Typography>
        </>
    );
};
