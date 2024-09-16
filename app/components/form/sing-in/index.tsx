"use client"

import React, {useState} from 'react';
import { useRouter } from 'next/navigation';
import type { FormProps } from 'antd';
import { Button,  Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import styles from './index.module.css'

type FieldType = {
  password?: string;
  email?: string;
};



const App: React.FC = () => {
  const router = useRouter();
  
  const [form] = useForm<FieldType>();

  const [formLoading, setFormType] = useState<boolean>(false);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setFormType(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', 
        {
          method: 'post', body: JSON.stringify(values), 
          headers: {'Content-Type': 'application/json'}
        }
      )
      const data = await res.json();
      if (res && res.ok) {
        message.success('Successfully registered');
        const token = data.token;
        document.cookie = `auth-token=${token}; max-age=${60 * 60 * 24 * 7}`;
        router.push('/')
        form.resetFields();
      } else {
        message.error(data?.message)
      }   
    } catch (error) {
      message.error(`Failed to register: Error: ${error}`)
    } finally {
      setFormType(false)
    }
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
  return (
    <div className={styles['sign-in']}>
      <div className={styles.title}>
        <h2>
          Sign In
        </h2>
      </div>
      <Form
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      >
        <Form.Item<FieldType>
          name="email"
          rules={[
            { required: true, message: 'Please input your name!' },
            { type: 'email', message: 'The input is not valid E-mail!'},
          ]}
        >
          <Input placeholder='Email'/>
        </Form.Item>
  
        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder='Password'/>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={formLoading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default App;