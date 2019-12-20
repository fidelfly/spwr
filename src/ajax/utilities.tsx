import { AxiosRequestConfig } from "axios";
import qs from "qs";

const formRequestConfig: AxiosRequestConfig = {
    transformRequest: (data: any): any => {
        // headers["content-type"] = "application/x-www-form-urlencoded";
        return qs.stringify(data);
    },
};

declare interface AxiosUtilities {
    FormRequestConfig: AxiosRequestConfig;
}

export const Ajaxkit: AxiosUtilities = {
    FormRequestConfig: formRequestConfig,
};
