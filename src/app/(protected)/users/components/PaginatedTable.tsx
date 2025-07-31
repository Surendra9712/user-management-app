'use client';

import {useEffect, useState} from 'react';
import {Button, Flex, Input, Popconfirm, Space, Table, Tag} from 'antd';
import type {ColumnsType, TablePaginationConfig} from 'antd/es/table';
import {SearchOutlined} from '@ant-design/icons';
import {User} from "@/types/user";
import {useUsers} from "@/hooks/useUsers";
import {AiOutlineDelete, AiOutlineEdit} from "react-icons/ai";
import {useUserDrawer} from "@/app/(protected)/users/provider/UserDrawerProvider";
import {useMessageApi} from "@/context/MessageProvider";

export default function PaginatedTable() {
    const {data = [], isLoading, deleteUser,} = useUsers();
    const {open, setUser} = useUserDrawer();
    const message = useMessageApi();
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 8,
        size:"default",
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        position: ['bottomRight'],
    })

    useEffect(() => {
        setFilteredData(data.map(item => ({...item, key: item.id})));
    }, [data]);

    const statusColors: Record<string, string> = {
        1: 'green',
        0: 'red',
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                {text: 'Admin', value: 'Admin'},
                {text: 'General Manager', value: 'General Manager'},
                {text: 'Sales Manager', value: 'Sales Manager'},
                {text: 'Branch Manager', value: 'Branch Manager'},
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status ? "Active" : "Inactive"}
                </Tag>
            ),
            filters: [
                {text: 'Active', value: 1},
                {text: 'Inactive', value: 0},
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Joined',
            dataIndex: 'joinDate',
            key: 'joinDate',
            sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button size={'small'} type={'text'} onClick={() => handleEditClick(record)}
                            icon={<AiOutlineEdit className="size-4"/>}></Button>
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => handleConfirmDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size={'small'} type={'text'} danger
                                icon={<AiOutlineDelete className="size-4"/>}></Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEditClick = (user: User) => {
        if (setUser) {
            setUser(user);
        }
        open();
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
        filterData(value);
    };

    const filterData = (search: string) => {
        let result = [...data];

        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(searchLower) ||
                item.email.toLowerCase().includes(searchLower))
        }

        setFilteredData(result);
        setPagination({...pagination, current: 1});
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination(pagination);
    };
    const handleConfirmDelete = async (user: User) => {
        await deleteUser(user.id);
        message.success('User deleted successfully.');
    }
    return (
        <Flex vertical gap={'middle'}>
            <Input
                placeholder="Search by name or email"
                prefix={<SearchOutlined/>}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className={'ml-auto max-w-xs'}
            />
            <Table
                size={'small'}
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{x: 'max-content'}}
                rowKey="key"
            />
        </Flex>
    );
}