import {Card as AntdCard} from "antd";
import {CardProps} from "antd/es/card";

export const Card = ({children, ...props}: CardProps) => {
    return <AntdCard {...props}>{children}</AntdCard>;
};