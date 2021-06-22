import React,{useState,useEffect} from 'react';
import './form.css';
import Input from '../../shared/components/formelements/input';
import {VALIDATOR_REQUIRE,VALIDATOR_EMAIL,VALIDATOR_PHONE} from '../../shared/util/validator';
import Personal from './personal_details';
import {useForm} from '../../shared/hooks/form_hook';
import {useHttp} from '../../shared/hooks/http_hook';
/*import axios from 'axios'; */

const Form=(props)=>{
	let uid=null;
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const {loading,error,sendReq,clearError}=useHttp();
	const [user,setUser]=useState(null);
	const [formState,formInputHandler,setFormData]=useForm(
		{
			first_name:{
				value:'',
				isValid:false
			},
			last_name:{
				value:'',
				isValid:false
			},
			email:{
				value:'',
				isValid:false
			},
			phone:{
				value:'',
				isValid:false
			}
		},false
	);


	const [next,setNext]=useState(false);

	useEffect(()=>{
		const getUser=async ()=>{
			try{
				const storedId=JSON.parse(localStorage.getItem('id'));
				if(storedId){
					uid=storedId.uid;
					const res=await sendReq("http://localhost:5000/getUserform1",
						"GET",
						null,
						{
							'uid':uid
						}
					);
					setUser(res.msg.success.data);
					setFormData({
						...formState.inputs,
						first_name:{
							value:res.msg.success.data.loan_app_name.first_name,
							valid:true
						},
						last_name:{
							value:res.msg.success.data.loan_app_name.last_name,
							valid:true
						},
						email:{
							value:res.msg.success.data.loan_app_mail,
							valid:true
						},
						phone:{
							value:res.msg.success.data.Mobile,
							valid:true
						}
					},true);
				}
			}catch(err){

			}	
		}
		getUser();
	},[sendReq,setFormData])


	/*const nextHandle=(e) => {
		const config = {
			data:{
					loan_app_name:{
						prefix:"",
						first_name:formState.inputs.first_name.value,
						last_name:formState.inputs.last_name.value,
						suffix:""
					},
					loan_app_mail:formState.inputs.email.value,
					Mobile:formState.inputs.phone.value
				}
		}
		axios.post('http://localhost:5000/', config)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
		e.preventDefault();
	}*/

	const nextHandle=async (event)=>{
		event.preventDefault();
		try{
			const storedId=JSON.parse(localStorage.getItem('id'));
			if(storedId){
				uid=storedId.uid;
			}
			if(uid){
				const res=await sendReq('http://localhost:5000/',
					'POST',
					JSON.stringify({
						data:{
							loan_app_name:{
								prefix:"",
								first_name:formState.inputs.first_name.value,
								last_name:formState.inputs.last_name.value,
								suffix:""
							},
							loan_app_mail:formState.inputs.email.value,
							Mobile:formState.inputs.phone.value
						}
					}),
					{
						'Content-Type':'application/json',
						'uid':uid
					},
				);
				console.log(res)
			}else{
				const res=await sendReq('http://localhost:5000/',
					'POST',
					JSON.stringify({
						data:{
							loan_app_name:{
								prefix:"",
								first_name:formState.inputs.first_name.value,
								last_name:formState.inputs.last_name.value,
								suffix:""
							},
							app_name:{
								prefix:"",
								first_name:formState.inputs.first_name.value,
								last_name:formState.inputs.last_name.value,
								suffix:""
							},
							loan_app_mail:formState.inputs.email.value,
							app_mail:formState.inputs.email.value,
							Mobile:formState.inputs.phone.value,
						}
					}),
					{
						'Content-Type':'application/json'
					},
				);
				console.log(res);
				if(res.msg.success && res.msg.success1){
					let id=res.msg.success.data.ID;
					let did=res.msg.success1.data.ID;
					localStorage.setItem(
						'id',
						JSON.stringify({uid:id})
					);
					localStorage.setItem(
						'did',
						JSON.stringify({did:did})
					);
				}
			}
		}catch(err){
			
		}
		setNext(true);
		if(!pid){
			localStorage.setItem(
				'pid',
				JSON.stringify({pid:1})
			);
		}
		
	};

	let component=null;
	if(next){
		component=<Personal go="update"/>;
	}else if(props.go && parseInt(pid)>=1){
		if(user){
		component=(
			<form className="form" onSubmit={nextHandle}>
				<h1><center>Authentication</center></h1>
				<hr/>
				<Input element="input" type="text" label="Firstname"
				id="first_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Firstname" 
				errorText="Please enter your first name"
				onInput={formInputHandler}
				initvalue={user.loan_app_name.first_name}
				initvalid={true} />

				<Input element="input" type="text" label="Lastname"
				id="last_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Lastname"
				errorText="Please enter your last name"
				onInput={formInputHandler}
				initvalue={user.loan_app_name.last_name}
				initvalid={true} />

				<Input element="input" type="email" label="Email" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_EMAIL()]}
				id="email"
				placeholder="Email"
				errorText="Invalid email"
				onInput={formInputHandler}
				initvalue={user.loan_app_mail}
				initvalid={true} />

				<Input element="input" type="phone" label="Phone" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_PHONE()]}
				id="phone"
				placeholder="Mobile number"
				errorText="Invalid mobile number"
				onInput={formInputHandler}
				initvalue={user.Mobile}
				initvalid={true} /> 

			<button type="submit" disabled={!formState.isValid}>Next</button> 

			</form>
		);
	}
	}else{
		component=(
			<form className="form" onSubmit={nextHandle}>
				<h1><center>Authentication</center></h1>
				<hr/>
				<Input element="input" type="text" label="Firstname"
				id="first_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Firstname" 
				errorText="Please enter your first name"
				onInput={formInputHandler} />

				<Input element="input" type="text" label="Lastname"
				id="last_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Lastname"
				errorText="Please enter your last name"
				onInput={formInputHandler} />

				<Input element="input" type="email" label="Email" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_EMAIL()]}
				id="email"
				placeholder="Email"
				errorText="Invalid email"
				onInput={formInputHandler} />

				<Input element="input" type="phone" label="Phone" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_PHONE()]}
				id="phone"
				placeholder="Mobile number"
				errorText="Invalid mobile number"
				onInput={formInputHandler} /> 

			<button type="submit" disabled={!formState.isValid}>Next</button> 

			</form>);
	}


	return(
		<React.Fragment>
			{component}
		</React.Fragment>
	);
};

export default Form;