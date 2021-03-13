import React, { ReactElement, MouseEvent, useState } from "react";
import { ButtonProps } from "antd/lib/button/button";
import { Button } from "antd";
import { useCountDown } from "../utilities";
import "./components.less";

type DelayButtonProps = {
    delay?: number;
} & ButtonProps &
    React.RefAttributes<HTMLElement>;

export const DelayButton: React.FC<DelayButtonProps> = (props: DelayButtonProps): ReactElement => {
    const { delay, disabled, children, onClick, ...others } = props;

    const [doing, setDoing] = useState<boolean>(false);
    const [count, counter] = useCountDown();

    function onClickFunc(e: MouseEvent<HTMLElement>) {
        setDoing(true);
        if (onClick != null) {
            new Promise(function (resolve) {
                resolve(onClick(e));
            })
                .then(function () {
                    counter.start(delay || -1);
                    // setCounting(true);
                })
                .finally(() => {
                    setDoing(false);
                });
        } else {
            setDoing(false);
            counter.start(delay || -1);
        }
    }
    return (
        <Button loading={doing} disabled={disabled || count >= 0} onClick={onClickFunc} {...others}>
            {children}
            {count >= 0 && <span className={"count-down"}>{`(${count} s)`}</span>}
        </Button>
    );
};
