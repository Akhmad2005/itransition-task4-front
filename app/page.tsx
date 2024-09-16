'use client'

import React, {useEffect, useState, useRef } from "react";
import styles from './page.module.css'
import { Table, Tag, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, LockOutlined, UnlockOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { getCookie } from '@/app/utilities/getToken';
import { Key } from "antd/es/table/interface";

type ActionType = 'block' | 'unblock' | 'delete' 

const columns = [
	{
		title:'',
		key: 'checkbox',
	},
	{
		title: 'ID',
		key: 'userId',
		dataIndex: 'userId',
	},
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
		title: 'Registration date',
		key: 'registrationDate',
		dataIndex: 'registrationDate',
	},
  {
		title: 'Last login date',
		key: 'lastLoginDate',
		dataIndex: 'lastLoginDate',
	},
	{
		title: 'Status',
		dataIndex:'status',
		key:'status',
		render: (text: string) => (
			<div 
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
			>
				<Tag color={text == 'active' ? 'green' : 'red'}>
					{text}
				</Tag>
			</div>
		)
	},
];

const ClientSideFetch = () => {
	const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Key[]>([]);

	const hasFetched = useRef(false);

	const buttonsStyle = {
		background: 'white'
	}

	const fetchData = async () => {
		setLoading(true);
		try {
			const token = getCookie('auth-token')
			const response = await fetch('http://localhost:5000/api/users',
				{
					headers: { 
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					
				}
			); 
			if (response && response.status === 401) {
				document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
				router.push('/login')
			}
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			} 
			
			
			const result = await response.json();
			setData(result);
		} catch (error: any) {
			setError(error);
			message.error(error)
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []); 

	const router = useRouter()

	const handleExit = () => {
		document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
		router.push('/login')
	}

	const handleClickButton = async (a: ActionType) => {
		try {
			const token = getCookie('auth-token')
			const response = await fetch(`http://localhost:5000/api/users/${a}`,
				{
					method: 'POST',
          body: JSON.stringify({
						userIds: selectedUserIds,
					}),
					headers: { 
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					
				}
			); 
			if (response && response.status === 401) {
				document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
				router.push('/login')
			}
			if (!response.ok) {
				throw new Error(`Failed to ${a} user`);
			}
		} catch (error: any) {
			setError(error);
			message.error(error)
		} finally {
			setSelectedUserIds([])
			fetchData()
			setLoading(false);
		}
	}

	return (
    <div className={styles.home}>
      <div className={styles.table}>
				<div className={styles['table-toolbar']}>
					<h3>Users</h3>
					<Button 
						style={buttonsStyle}					
						icon={<LockOutlined />}
						disabled={!selectedUserIds.length} 
						onClick={() => handleClickButton('block')}
					>
						Block
					</Button>
					<Button 
						style={buttonsStyle}
						icon={<UnlockOutlined />} 
						disabled={!selectedUserIds.length} 
						onClick={() => handleClickButton('unblock')}
					>
							Unblock
					</Button>
					<Popconfirm 
						
						title="Delete the task"
						description="Are you sure to delete this task?"
						onConfirm={() => handleClickButton('delete')}
						okText="Yes"
						cancelText="No"
					>
						<Button 
							style={buttonsStyle}
							danger
							icon={<DeleteOutlined />} 
							disabled={!selectedUserIds.length} 
						>
							Delete
						</Button>
					</Popconfirm>
				</div>
				<div className={styles['table-body']}>
					<Table 
						loading={loading}
						rowSelection={{
							type: 'checkbox',
							onChange: (keys: Key[]) => setSelectedUserIds(keys),
							selectedRowKeys: selectedUserIds,
						}}
						dataSource={data} 
						columns={columns} 
						rowKey='userId'
						pagination={{pageSize: 5}}
					/>
				</div>
				<div className={styles.exit}>
					<Button
					 	type="primary"
						danger
						icon={<LogoutOutlined />} 
						onClick={handleExit}
					>
						Exit
					</Button>
				</div>
			</div>
    </div>
  );
}


export default ClientSideFetch;