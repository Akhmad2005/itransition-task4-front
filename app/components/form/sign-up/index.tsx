"use client"

import React, {useState} from 'react';
import { FormProps, message } from 'antd';
import { Button,  Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import styles from './index.module.css'

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};


const App: React.FC = () => {

  const [form] = useForm<FieldType>();

  const [formLoading, setFormType] = useState<boolean>(false);
  
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setFormType(true)
    let fields = values
    delete fields.confirm
    try {
      const res = await fetch('https://itransition-task4-back-pvx5.vercel.app/api/auth/register', 
        {
          method: 'post', body: JSON.stringify(fields), 
          headers: {'Content-Type': 'application/json'}
        }
      )
      const data = await res.json();
      if (res && res.ok) {
        message.success('Successfully registered')
        form.resetFields();
      } else if ( data?.message && data?.message == 'Email was already registrated!') {
        form.setFields([{
          name: 'email',
          errors: [data?.message]
        }])
        message.error(data?.message)
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
          Sign Up
        </h2>
      </div>
      <Form
      form={form}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      >
        <Form.Item<FieldType>
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder='Name'/>
        </Form.Item>
        <Form.Item<FieldType>
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
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
  
        <Form.Item<FieldType>
          name="confirm"
          rules={[
            { required: true, message: 'Please input your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder='Password'/>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button loading={formLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default App;