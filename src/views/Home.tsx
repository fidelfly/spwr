import React, { Component, ReactElement } from "react";
import { injectIntl } from "react-intl";

class HomeView extends Component<any, any> {
    render(): ReactElement {
        return <div>{"asdf"}</div>;
    }
}

export default injectIntl(HomeView);
