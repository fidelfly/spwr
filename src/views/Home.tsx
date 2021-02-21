import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { viewLoading } from "../actions";

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
    return <div>{"asdf"}</div>;
};

async function wait5() {
    return new Promise((resolve): unknown => setTimeout(resolve, 1000));
}
