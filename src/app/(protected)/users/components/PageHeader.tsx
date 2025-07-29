"use client"

import {Flex, Typography} from "antd";
import {AiOutlinePlus} from "react-icons/ai";
import {useUserDrawer} from "@/app/(protected)/users/provider/UserDrawerProvider";
import { Button } from "@surendra9712/ui-components";
const {Title}=Typography;

const PageHeader = ()=>{
    const {open} = useUserDrawer();
    return(
        <Flex className="border-b !mb-6" justify="space-between" align="center" gap={'small'}>
            <Typography>
                <Title>Users</Title>
            </Typography>
            <Button onClick={open} variant="filled" type={'primary'}><AiOutlinePlus/> New</Button>
        </Flex>
    )
}

export default PageHeader;