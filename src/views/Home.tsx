import React, { Component, ReactElement } from "react";
import { injectIntl } from "react-intl";

class HomeView extends Component<never, never> {
    render(): ReactElement {
        return <div>{"asdf"}</div>;
    }
}

export default injectIntl(HomeView);
