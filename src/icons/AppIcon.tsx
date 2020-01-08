import React, { ReactElement } from "react";
import Icon from "@ant-design/icons";

const AppSvg: React.FC = () => (
    <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        width="1em"
        height="1em">
        <path
            d="M723.946667 217.344a21.184 21.184 0 0 1-10.218667-2.624l-130.624-71.616a21.333333 21.333333 0 0 1-7.445333-30.613333L644.906667 9.429333a21.333333 21.333333 0 0 1 27.968-6.805333l130.666666 71.573333a21.312 21.312 0 0 1 7.445334 30.592l-69.290667 103.104a21.418667 21.418667 0 0 1-17.749333 9.450667zM624.064 116.906667l93.056 51.029333 45.397333-67.541333-93.098666-50.986667-45.354667 67.498667z"
            p-id="3317"></path>
        <path
            d="M527.04 624.832l-263.829333-144.554667L487.744 146.005333c18.986667-28.288 51.178667-45.845333 83.968-45.845333 14.272 0 28.117333 3.456 40.064 10.005333L726.037333 172.8a75.605333 75.605333 0 0 1 37.418667 48.981333c5.802667 23.765333 0.682667 49.984-14.058667 71.957334l-222.357333 331.093333z m-202.368-159.530667l188.693333 103.36 200.618667-298.709333c8.064-12.032 11.008-25.898667 8.042667-38.058667a33.088 33.088 0 0 0-16.469334-21.696l-114.282666-62.634666c-20.501333-11.221333-52.8-0.533333-68.074667 22.229333l-198.528 295.509333z"
            p-id="3318"></path>
        <path
            d="M528.853333 1024a21.333333 21.333333 0 1 1 0-42.666667c206.677333 0 374.805333-150.933333 374.805334-336.448 0-120.661333-72.682667-232.789333-189.717334-292.586666a21.333333 21.333333 0 0 1 19.413334-38.016c131.349333 67.136 212.949333 193.813333 212.949333 330.581333C946.325333 853.909333 759.061333 1024 528.853333 1024z"
            p-id="3319"></path>
        <path
            d="M885.034667 1024h-603.52a21.333333 21.333333 0 1 1 0-42.666667h603.541333a21.333333 21.333333 0 1 1-0.021333 42.666667z"
            p-id="3320"></path>
        <path
            d="M598.4 1011.882667a21.333333 21.333333 0 0 1-20.416-15.146667c-0.576-1.941333-60.096-193.493333-194.944-248.021333a21.333333 21.333333 0 1 1 15.978667-39.552c153.941333 62.208 217.194667 266.538667 219.797333 275.2a21.333333 21.333333 0 0 1-20.416 27.52z"
            p-id="3321"></path>
        <path
            d="M683.050667 750.272H99.008a21.333333 21.333333 0 1 1 0-42.666667h584.021333a21.333333 21.333333 0 1 1 0.021334 42.666667z"
            p-id="3322"></path>
    </svg>
);

export const AppIcon = (props: any): ReactElement => {
    return <Icon component={AppSvg} {...props} />;
};
