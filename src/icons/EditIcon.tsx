import React, { ReactElement } from "react";
import Icon from "@ant-design/icons";
import IconProps from "./types";

const EditSvg: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="1em" height="1em" viewBox="0 0 72.105 72.103">
        <g id="edit" transform="translate(21709.223 12552)">
            <path
                id="pen"
                d="M63.832,2.874a9.931,9.931,0,0,0-14.033,0L46.273,6.4,8.891,43.783l-.081.081c-.018.018-.018.039-.039.039-.039.06-.1.12-.138.18s-.021.021-.021.039a1.046,1.046,0,0,1-.1.159c-.039.06-.018.039-.039.06a.684.684,0,0,0-.06.159c-.021.06-.018.018-.018.039L.106,69.474A1.954,1.954,0,0,0,.582,71.5a2,2,0,0,0,1.411.575,2.342,2.342,0,0,0,.635-.1l24.926-8.316c.018,0,.018,0,.039-.018a.705.705,0,0,0,.176-.088.071.071,0,0,0,.042,0c.06-.039.138-.081.2-.12s.12-.1.18-.138.025-.032.025-.053.06-.039.081-.081L69.2,22.253a9.931,9.931,0,0,0,0-14.033ZM11.158,48.858,23.226,60.926,5.106,66.956ZM66.41,19.47l-2.116,2.116L50.494,7.793,52.61,5.677a5.953,5.953,0,0,1,8.415,0l5.4,5.4A5.974,5.974,0,0,1,66.41,19.47Zm0,0"
                transform="translate(-21709.223 -12551.971)"
            />
        </g>
    </svg>
);

export const EditIcon = (props: IconProps): ReactElement => {
    return <Icon component={EditSvg} {...props} />;
};
