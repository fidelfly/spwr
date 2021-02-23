import React, { ReactElement } from "react";
import IconProps from "./types";
import Icon from "@ant-design/icons";

const MenuSvg: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="1em" height="1em" viewBox="0 0 100.551 70.714">
        <g id="menu" transform="translate(-3 -7.5)">
            <path
                id="Path_2297"
                data-name="Path 2297"
                d="M3.007,12.527A4.729,4.729,0,0,1,7.364,7.5H85.739A4.729,4.729,0,0,1,90.1,12.527a4.729,4.729,0,0,1-4.357,5.027H7.364a4.729,4.729,0,0,1-4.357-5.027Z"
                transform="translate(13.445)"
            />
            <path
                id="Path_2298"
                data-name="Path 2298"
                d="M11.334,21.575a5.027,5.027,0,0,1,5.027-5.027H78.917a5.027,5.027,0,1,1,0,10.054H16.361A5.027,5.027,0,0,1,11.334,21.575Z"
                transform="translate(19.596 21.275)"
            />
            <path
                id="Path_2299"
                data-name="Path 2299"
                d="M8.027,25.6a5.027,5.027,0,0,0,0,10.054H98.513a5.027,5.027,0,1,0,0-10.054Z"
                transform="translate(0 42.559)"
            />
        </g>
    </svg>
);

export const MenuIcon = (props: IconProps): ReactElement => {
    return <Icon component={MenuSvg} {...props} />;
};
