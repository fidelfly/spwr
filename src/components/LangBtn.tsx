import React, { ReactElement } from "react";
import { Button } from "antd";
import { changeLang } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { appMessages } from "../constants";
import { StoreState } from "../type";
import { Storage } from "../constants";

export const LangBtn: React.FC = (): ReactElement => {
    const language = useSelector<StoreState, string>((state) => state.language);
    const dispatch = useDispatch();

    function toggleLanguage() {
        let newLang: string;
        if (language === "en") {
            newLang = "zh";
        } else {
            newLang = "en";
        }

        dispatch(changeLang(newLang));
        localStorage.setItem(Storage.Lang, newLang);
    }

    return (
        <Button htmlType={"button"} size="small" onClick={toggleLanguage}>
            <FormattedMessage {...(language === "en" ? appMessages.langZh : appMessages.langEn)} />
        </Button>
    );
};
