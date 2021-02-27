import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { viewLoading } from "../../actions";
import { ReactComponent as DateIcon } from "../../assets/svg/date.svg";
import snowflake from "../../assets/image/snowflake.png";
import { Button, message, Space } from "antd";
import { AjaxMessage, Ajax, AjaxKit } from "../../ajax";
import { useAjaxHandler } from "../../utilities";
import { FormattedMessage } from "react-intl";
import { appMessages } from "../../constants";

export const Home: React.FC = (): ReactElement => {
    const dispatch = useDispatch();
    const ajaxHandler = useAjaxHandler();
    useEffect(
        function () {
            dispatch(viewLoading(true, "fidel is testing"));
            wait5().finally(() => {
                dispatch(viewLoading(false));
            });

            return;
        },
        [dispatch]
    );

    /*    async function msgExample(type: string) {
        try {
            const resp = await Ajax.get<AjaxMessage>(AjaxKit.getPath("/example/message/{type}", { type: type }));
            handlerMessage.call(this, resp.data);
        } catch (e) {
            handlerMessage(e.data);
        }
    }*/

    const msgExample = async (type: string) => {
        try {
            const resp = await Ajax.get<AjaxMessage>(AjaxKit.getPath("/example/message/{type}", { type: type }));
            // handlerMessage(resp.data);
            ajaxHandler.showMessage(resp.data);
        } catch (e) {
            ajaxHandler.showMessage(e.data);
        }
    };

    const unauthorizedRequest = async () => {
        try {
            await Ajax.get("/example/unauthorized");
        } catch (e) {
            console.log(e);
        }
    };

    const errorExample = async () => {
        try {
            await Ajax.get("/example/error");
        } catch (e) {
            ajaxHandler.showMessage(e.data);
            console.log(e);
        }
    };

    return (
        <div>
            <FormattedMessage {...appMessages.name} />
            <p>
                {"Use svg as Icon:"}
                <DateIcon />
            </p>
            <p>
                {"Use png as image:"}
                <img src={snowflake} alt={"snowflake"} />
            </p>
            <Space direction={"vertical"}>
                <Space>
                    <Button type={"primary"} onClick={() => msgExample("info")}>
                        {"General Message"}
                    </Button>
                    <Button onClick={() => msgExample("warning")}>{"Warning Message"}</Button>
                    <Button danger onClick={() => msgExample("error")}>
                        {"Error Message"}
                    </Button>
                    <Button onClick={() => msgExample("success")}>{"Success Message"}</Button>
                    <Button type={"primary"} danger onClick={() => errorExample()}>
                        {"Ajax Error"}
                    </Button>
                </Space>

                <Button onClick={() => unauthorizedRequest()}>{"Unauthorized Request"}</Button>
            </Space>
        </div>
    );
};

async function wait5() {
    return new Promise((resolve): unknown => setTimeout(resolve, 1000));
}
