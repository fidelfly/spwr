import React, { ReactElement } from "react";
import { Avatar, Divider } from "antd";
import { Link } from "react-router-dom";
import { StoreState, User } from "../../type";
import { LangBtn } from "../../components";
import { WsPath } from "../../constants";
import { AjaxKit } from "../../ajax";
import { useSelector } from "react-redux";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons/lib";

export const Header: React.FC = (): ReactElement => {
    const user = useSelector<StoreState, User>((state) => state.user as User);
    return (
        <div className={"app-head-navi"}>
            <LangBtn />
            <Divider type={"vertical"} />
            <Link to={"/app/account/profile"}>
                {user.avatar != null && user.avatar > 0 ? (
                    <Avatar
                        className={"avatar"}
                        size={40}
                        src={AjaxKit.getPath(WsPath.avatar.get, { key: user.avatar }, true)}
                    />
                ) : (
                    <Avatar size={40} className={"avatar"} icon={<UserOutlined />} />
                )}
                <span className={"avatar-name"}>{user.name}</span>
            </Link>
            <Divider type={"vertical"} />
            <Link to={"/logout"} className={"logout"}>
                <LogoutOutlined />
            </Link>
        </div>
    );
};
