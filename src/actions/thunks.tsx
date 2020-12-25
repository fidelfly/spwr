import { Ajax, AjaxKit } from "../ajax";
import { WsPath } from "../constants";
import { updateUser } from "./index";
import { AsyncDispatch, ThunkResult, User } from "../type";

export const loadUser = function (userId: number): ThunkResult<Promise<User>> {
    return async (dispatch: AsyncDispatch): Promise<User> => {
        const resp = await Ajax.get(AjaxKit.getPath(WsPath.user, userId));
        const user: User = {
            id: resp.data.id,
            code: resp.data.code,
            name: resp.data.name,
            email: resp.data.email,
            avatar: resp.data.avatar,
        } as User;

        dispatch(updateUser(user));
        return user;
    };
};

/*export const updateUserAcl = function(userId) {
    return async (dispatch: Dispatch): Promise<any> => {
        const resp = Ajax.get(AjaxKit.getPath(WsPath.ListAcl, userId)).then((rsp) => {
            dispatch(updateAcl(rsp));
        });
    };
};*/
