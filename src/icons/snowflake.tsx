import React, { ReactElement } from "react";
import Icon from "@ant-design/icons";

const SnowSvg: React.FC = () => (
    <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="1em"
        height="1em">
        <path
            d="M512 644.394667c-73.002667 0-132.394667-59.392-132.394667-132.394667s59.392-132.394667 132.394667-132.394667 132.394667 59.392 132.394667 132.394667-59.392 132.394667-132.394667 132.394667z m0-222.122667c-49.472 0-89.728 40.256-89.728 89.728s40.256 89.728 89.728 89.728 89.728-40.256 89.728-89.728-40.256-89.728-89.728-89.728z"
            p-id="2222"></path>
        <path
            d="M511.978667 1024a21.333333 21.333333 0 0 1-21.333334-21.333333V628.608a21.333333 21.333333 0 1 1 42.666667 0V1002.666667a21.333333 21.333333 0 0 1-21.333333 21.333333zM511.978667 416.746667a21.333333 21.333333 0 0 1-21.333334-21.333334V21.333333a21.333333 21.333333 0 0 1 42.666667 0v374.08a21.333333 21.333333 0 0 1-21.333333 21.333334zM936.874667 778.666667a21.162667 21.162667 0 0 1-10.645334-2.858667L602.282667 588.8a21.333333 21.333333 0 1 1 21.333333-36.949333l323.946667 187.008a21.312 21.312 0 0 1-10.688 39.808zM410.986667 475.050667a21.269333 21.269333 0 0 1-10.645334-2.858667L76.394667 285.141333a21.333333 21.333333 0 0 1 21.333333-36.949333l323.946667 187.050667a21.333333 21.333333 0 0 1-10.688 39.808zM612.970667 475.029333a21.333333 21.333333 0 0 1-10.688-39.808l323.946666-187.029333a21.333333 21.333333 0 0 1 21.333334 36.949333l-323.946667 187.029334a21.162667 21.162667 0 0 1-10.645333 2.858666zM87.082667 778.666667a21.333333 21.333333 0 0 1-10.688-39.808l323.946666-187.050667a21.333333 21.333333 0 1 1 21.333334 36.949333L97.728 775.808a21.226667 21.226667 0 0 1-10.645333 2.858667z"
            p-id="2223"></path>
        <path
            d="M948.885333 682.837333a21.184 21.184 0 0 1-11.050666-3.114666l-188.586667-114.432v-106.581334l188.586667-114.432a21.333333 21.333333 0 1 1 22.122666 36.48l-168.042666 101.973334v58.56l168.042666 101.973333a21.290667 21.290667 0 0 1 7.168 29.290667 21.226667 21.226667 0 0 1-18.24 10.282666zM75.114667 682.837333a21.333333 21.333333 0 0 1-11.093334-39.552l168.042667-101.973333v-58.56l-168.021333-101.973333a21.333333 21.333333 0 1 1 22.144-36.48l188.565333 114.432v106.581333L86.186667 679.744a21.418667 21.418667 0 0 1-11.072 3.093333z"
            p-id="2224"></path>
        <path
            d="M676.778667 333.184l-92.288-53.290667-4.821334-220.544a21.333333 21.333333 0 0 1 20.885334-21.802666c12.010667 0.298667 21.546667 9.109333 21.781333 20.864l4.266667 196.544 50.709333 29.269333 172.352-94.549333a21.333333 21.333333 0 0 1 20.501333 37.418666l-193.386666 106.090667zM423.018667 986.496c-11.562667 0-21.056-9.258667-21.333334-20.885333l-4.288-196.522667-50.709333-29.290667-172.352 94.570667a21.333333 21.333333 0 1 1-20.522667-37.418667l193.408-106.112 92.309334 53.290667 4.842666 220.565333a21.333333 21.333333 0 0 1-20.864 21.781334l-0.490666 0.021333z"
            p-id="2225"></path>
        <path
            d="M347.221333 333.184L153.813333 227.093333a21.333333 21.333333 0 0 1 20.522667-37.418666l172.352 94.549333 50.709333-29.269333 4.288-196.544c0.256-11.776 9.024-21.141333 21.802667-20.864a21.333333 21.333333 0 0 1 20.864 21.802666l-4.821333 220.544-92.309334 53.290667zM601.002667 986.496h-0.448a21.376 21.376 0 0 1-20.885334-21.781333l4.821334-220.565334 92.288-53.290666 193.408 106.112a21.333333 21.333333 0 1 1-20.522667 37.418666l-172.330667-94.570666-50.709333 29.290666-4.266667 196.522667a21.354667 21.354667 0 0 1-21.354666 20.864z"
            p-id="2226"></path>
    </svg>
);

export const Snowflake = (props: any): ReactElement => {
    return <Icon component={SnowSvg} {...props} />;
};
