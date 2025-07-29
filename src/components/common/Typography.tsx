import {Typography as AntdTypography} from "antd";

const {Title, Paragraph, Text, Link} = AntdTypography;

export const AppText = ({...props}) => {
    return (
        <Text {...props} />
    );
};

export const AppTitle = ({...props}) => {
    return <Title  {...props} />;
};

export const AppParagraph = ({...props}) => {
    return <Paragraph {...props} />;
};

export const AppLink = ({...props}) => {
    return <Link {...props} />;
};

const Typography = {
    Title: AppTitle,
    Text: AppText,
    Paragraph: AppParagraph,
    Link: AppLink,
};

export default Typography;
