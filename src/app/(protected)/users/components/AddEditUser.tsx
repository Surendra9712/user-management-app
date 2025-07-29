"use client"
import {DatePicker, Drawer, Radio, Select, Space} from "antd";
import {useEffect} from "react";
import {useUsers} from "@/hooks/useUsers";
import {Button, Form, FormItem, Input, useFormHandler, validators,RadioGroup } from "@surendra9712/ui-components";
import {UserFormData} from "@/types/userFormData";
import {useMessageApi} from "@/context/MessageProvider";
import {useUserDrawer} from "@/app/(protected)/users/provider/UserDrawerProvider";
import dayjs from "dayjs";
import {isNullOrUndefinedOrEmpty} from "@/utils/helper";

const AddEditUser = () => {
    const message = useMessageApi();
    const {isOpen, user, close, setUser} = useUserDrawer();
    const {createUser, createUserLoading, updateUser, updateUserLoading} = useUsers();
    const initialState = {
        name: '',
        email: '',
        address: '',
        status: 1,
        gender: 1,
        joinDate: '',
        phone: undefined,
        role: '',
    }

    const validationSchema: Record<string, [(value: any, formData?: UserFormData) => boolean, string][]> = {
        name: [
            [validators.required, 'Full name is required'],
            [validators.maxLength(100), 'Full name should not be greater than 100 characters']
        ],
        email: [
            [validators.required, 'Email is required'],
            [validators.email, 'Invalid email format']
        ],
        phone: [
            [validators.required, 'Phone number is required'],
            [validators.maxLength(10), 'Phone number should not be greater than 10 characters']
        ],
        gender: [],
        status: [],
        joinDate: [[validators.required, 'Join Date is required']],
        address: [],
        role: [[validators.required, 'Role is required']],
    };

    const {
        formData,
        errors,
        touched,
        setFormData,
        handleChange,
        handleBlur,
        validateForm,
        resetForm,
    } = useFormHandler<UserFormData>(
        initialState,
        validationSchema
    );
    const handleSubmit = async () => {
        const isValid = validateForm();
        if (!isValid) return;
        if (user) {
            await updateUser({id: user.id, updated: formData})
            message.success('User updated successfully.');

        } else {
            await createUser(formData);
            message.success('User created successfully.');
        }
        handleClose();
    };

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData(initialState)
        }
    }, [user]);

    const handleClose = () => {
        resetForm();
        setUser(null);
        close();
    }
    const isLoading = createUserLoading || updateUserLoading;
    return (
        <div>
            <Drawer
                title="Add User"
                closable={{'aria-label': 'Close Button'}}
                onClose={handleClose}
                open={isOpen}
                footer={
                    <Space className="text-end">
                        <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
                        <Button disabled={isLoading} loading={isLoading} type="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Space>
                }
                styles={{footer: {textAlign: 'right'}}}
            >
                <Form formErrors={errors}
                      touchedFields={touched}>
                    <div>
                        <FormItem name={'name'} label={'Full Name'}>
                            <Input
                                placeholder={'Enter full name'}
                                value={formData.name}
                                onBlur={() => handleBlur('name')}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </FormItem>
                        <FormItem name={'email'} label={'Email'}>
                            <Input
                                placeholder={'Enter email'}
                                value={formData.email}
                                onBlur={() => handleBlur('email')}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </FormItem>
                        <FormItem name={'phone'} label={'Phone Number'}>
                            <Input
                                type="number"
                                placeholder={'Enter phone number'}
                                value={formData.phone || ''}
                                onBlur={() => handleBlur('phone')}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </FormItem>
                        <FormItem name="gender" label={'Gender'}>
                            <Radio.Group
                                value={formData.gender}
                                options={[
                                    {value: 1, label: 'Male'},
                                    {value: 2, label: 'Female'},
                                    {value: 3, label: 'Other'},
                                ]}
                            />
                        </FormItem>
                        <FormItem label={'Status'}>
                            <Radio.Group
                                onChange={(e) => handleChange('status', e.target.value)}
                                value={formData.status}
                                options={[
                                    {value: 1, label: 'Active'},
                                    {value: 0, label: 'Inactive'},
                                ]}
                            />
                        </FormItem>
                        <FormItem name={'joinDate'} label={'Joined Date'}>
                            <DatePicker
                                className={'w-full'}
                                value={formData.joinDate ? dayjs(formData.joinDate) : undefined}
                                placeholder={'Select date'}
                                onBlur={() => handleBlur('joinDate')}
                                onChange={(e, date) => handleChange('joinDate', date)}
                            />
                        </FormItem>
                        <FormItem name={"role"} label={'Role'}>
                            <Select
                                placeholder={'Select role'}
                                className={'w-full'}
                                value={!isNullOrUndefinedOrEmpty(formData.role) ? formData.role : undefined}
                                options={[
                                    {label: 'Admin', value: "Admin"},
                                    {label: 'General Manager', value: "General Manager"},
                                    {label: 'Sales Manager', value: "Sales Manager"},
                                    {label: 'Branch Manager', value: "Branch Manager"},
                                ]}
                                onBlur={() => handleBlur('role')}
                                onChange={(value) => handleChange('role', value)}
                            />
                        </FormItem>
                        <FormItem name={'address'} label={'Address'}>
                            <Input
                                placeholder={'Enter address'}
                                value={formData.address}
                                onBlur={() => handleBlur('address')}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </FormItem>
                    </div>
                </Form>
            </Drawer>
        </div>
    )
}

export default AddEditUser;