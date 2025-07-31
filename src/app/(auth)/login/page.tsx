import LoginForm from "@/app/(auth)/components/LoginForm";
import {Card} from "@/components/common/Card";
import {Flex} from "antd";
export const metadata = {
    title: 'Login',
};
const LoginPage = () => {
    return (<Flex justify="center" align="center" className="min-h-[calc(100vh-112px)]">
            <Card className="w-full max-w-md shadow-lg">
                <LoginForm/>
            </Card>
        </Flex>
    );
};

export default LoginPage;