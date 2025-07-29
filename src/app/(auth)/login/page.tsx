import LoginForm from "@/app/(auth)/components/LoginForm";
import {Card} from "@/components/common/Card";
import {Flex} from "antd";

const LoginPage = () => {
    return (<Flex justify="center" align="center" className="min-h-[calc(100vh-112px)]">
            <Card className="w-full max-w-md">
                <LoginForm/>
            </Card>
        </Flex>
    );
};

export default LoginPage;