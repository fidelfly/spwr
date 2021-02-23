import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { viewLoading } from "../../actions";
import { ReactComponent as DateIcon } from "../../assets/svg/date.svg";
import snowflake from "../../assets/image/snowflake.png";

export const Home: React.FC = (): ReactElement => {
    const dispatch = useDispatch();
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
    return (
        <div>
            <p>
                {"Use svg as Icon:"}
                <DateIcon />
            </p>
            <p>
                {"Use png as image:"}
                <img src={snowflake} alt={"snowflake"} />
            </p>
        </div>
    );
};

async function wait5() {
    return new Promise((resolve): unknown => setTimeout(resolve, 1000));
}
