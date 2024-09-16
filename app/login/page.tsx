'use client'

import React, {useState} from "react";
import styles from './page.module.css'
import SignIn from '@/app/components/form/sing-in/index'
import SignUp from '@/app/components/form/sign-up/index'
import { Segmented } from "antd";

type FormType = 'signin' | 'signup'

function LoginPage() {
	const [formType, setFormType] = useState<FormType>('signin');
	const FormComponent = formType == 'signin' ?  SignIn : SignUp ;
	
	return (
		<div className={styles.login}>
			<div className={styles['login-wrapper']}>
				<div className={styles.form}>
					<FormComponent></FormComponent>
				</div>
				<Segmented options={[
						{value: 'signin', title: 'Sign In', label: 'Sign In'},
						{value: 'signup', title: 'Sign Up', label: 'Sign Up'},
				 	]}
					block
					value={formType}
					onChange={(e: FormType) => {setFormType(e)}}
				 >
				 </Segmented>
			</div>
    </div>
	);
}



export default LoginPage