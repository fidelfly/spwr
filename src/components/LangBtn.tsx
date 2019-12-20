import React, { ReactElement } from "react";
import { Button } from "antd";
import { changeLang } from "../actions";
import { connect, ConnectedProps } from "react-redux";
import { FormattedMessage } from "react-intl";
import { appMessages } from "../constants";
import { StoreState } from "../type";
import { Storage } from "../constants";

interface Props {
    language: string;
}

const mapStateToProps = (state: StoreState): Props => {
    return {
        language: state.language,
    };
};

const connector = connect(mapStateToProps);

type BtnProps = ConnectedProps<typeof connector> & Props;

class LangBtn extends React.Component<BtnProps, object> {
    toggleLanguage = (lang: string): void => {
        let newLang = "en";
        if (lang === "en") {
            newLang = "zh";
        }
        const { dispatch } = this.props;
        dispatch(changeLang(newLang));
        localStorage.setItem(Storage.Lang, newLang);
    };

    render(): ReactElement {
        const { language } = this.props;
        return (
            <Button htmlType={"button"} size="small" onClick={this.toggleLanguage.bind(this, language)}>
                <FormattedMessage {...(language === "en" ? appMessages.langZh : appMessages.langEn)} />
            </Button>
        );
    }
}

export default connector(LangBtn);
