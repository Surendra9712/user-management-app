"use client"
import {Button, Form, FormItem, Input, useFormHandler, validators} from "@surendra9712/ui-components";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import ErrorSpan from "@/components/common/ErrorSpan";

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setRedirecting] = useState(false);
    const [error, setError] = useState<string>();
    const router = useRouter();

    const validationSchema: Record<string, [(value: any, formData?: {
        email: string,
        password: string
    }) => boolean, string][]> = {
        password: [
            [validators.required, 'Password is required']
        ],
        email: [
            [validators.required, 'Email is required'],
            [validators.email, 'Invalid email format']
        ],
    };

    const {
        formData,
        errors,
        handleChange,
        handleBlur,
        validateForm,
    } = useFormHandler(
        {
            password: '',
            email: '',
        },
        validationSchema
    );
    const handleSubmit = async () => {
        const isValid = validateForm();
        if (!isValid) return;
        setIsLoading(true);
        const res = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false
        });
        setIsLoading(false);
        if (res?.error) {
            setError("Invalid login credentials.");
        } else if (res?.ok) {
            setRedirecting(true);
            router.push("/dashboard");
        }
    };

    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="text-lg font-semibold">Redirecting to dashboard...</div>
                <div className="text-sm text-gray-500 mt-2">Please wait a moment.</div>
            </div>
        )
    }

    return (
        <Form formErrors={errors}>
            <div>
                <h1 className="text-2xl font-bold mb-6 text-center">User Login</h1>
                {error &&
                    <div className="flex justify-center">
                        <ErrorSpan message={error}></ErrorSpan>
                    </div>
                }

                <FormItem name={'email'} label={'Username'}>
                    <Input
                        type="email"
                        placeholder={'Username'}
                        value={formData.email}
                        onBlur={() => handleBlur('email')}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </FormItem>
                <FormItem name={'password'} label={"Password"}>
                    <Input
                        type="password"
                        placeholder={'Enter password'}
                        value={formData.password}
                        onBlur={() => handleBlur('password')}
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                </FormItem>
                <Button
                    type="primary"
                    variant="filled"
                    disabled={isLoading}
                    className="w-full"
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </Form>
    )
}

export default LoginForm;