import React,{useState,useEffect} from 'react';
import './form.css';
import '../../shared/components/formelements/input.css';
import Form from './form';
import {useForm} from '../../shared/hooks/form_hook';
import Input from '../../shared/components/formelements/input';
import {VALIDATOR_REQUIRE,VALIDATOR_NUMBER,VALIDATOR_POSITIVE} from '../../shared/util/validator';
import Personal from './personal_details';
import Residence from './residence';
import {useHttp} from '../../shared/hooks/http_hook';

const LoanDetails=(props)=>{
	let uid=null;
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const [school,setSchool]=useState("School");
	const [back,setBack]=useState(false);
	const [front,setFront]=useState(false);
	const [user,setUser]=useState(null);
	const {loading,error,sendReq,clearError}=useHttp();
	const [formState,formInputHandler,setFormData]=useForm(
		{
			inst_name:{
				value:'',
				isValid:false
			},
			loc:{
				value:'',
				isValid:false
			},
			c_name:{
				value:'',
				isValid:false
			},
			cls:{
				value:'',
				isValid:true
			},
			tenure:{
				value:'',
				isValid:false
			},
			amount:{
				value:'',
				isValid:false
			},
			amount_fn:{
				value:'',
				isValid:false
			},
			loan_tenure:{
				value:'',
				isValid:false
			}
		},false
	);

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
					if(res.msg.success.data.Type_of_Institute){
						setSchool(res.msg.success.data.Type_of_Institute);
					}
					setFormData({
						...formState.inputs,
						inst_name:{
							value:res.msg.success.data.Institute_Name,
							isValid:true
						},
						loc:{
							value:res.msg.success.data.Location_of_Institute,
							isValid:true
						},
						c_name:{
							value:res.msg.success.data.Course_Name,
							isValid:true
						},
						cls:{
							value:res.msg.success.data.Class_of_Student,
							isValid:true
						},
						tenure:{
							value:res.msg.success.data.Course_Tenure,
							isValid:true
						},
						amount:{
							value:res.msg.success.data.Course_Fee_Amount,
							isValid:true
						},
						amount_fn:{
							value:res.msg.success.data.financing_required,
							isValid:true
						},
						loan_tenure:{
							value:res.msg.success.data.Loan_Tenure,
							isValid:true
						}

					},true)
				}
			}catch(err){

			}	
		}
		getUser();
	},[sendReq]);

	const setSchoolHandler=(event)=>{
		setSchool(event.target.value);
	};

	const backHandle=()=>{
		setBack(true);
		setFront(false);
	};

	const nextHandle=async (event)=>{
		event.preventDefault();
		try{
  			const storedId=JSON.parse(localStorage.getItem('id'));
			if(storedId){
				uid=storedId.uid;
			}
			if(uid){
				const res=await sendReq('http://localhost:5000/form2',
					'POST',
					JSON.stringify({
						data:{
							Institute_Name:formState.inputs.inst_name.value,
							Type_of_Institute:school,
							Location_of_Institute:formState.inputs.loc.value,
							Course_Name:formState.inputs.c_name.value,
							Class_of_Student:formState.inputs.cls.value,
							Course_Tenure:formState.inputs.tenure.value,
							Course_Fee_Amount:formState.inputs.amount.value,
							financing_required:formState.inputs.amount_fn.value,
							Loan_Tenure:formState.inputs.loan_tenure.value
						}
					}),
					{
						'Content-Type':'application/json',
						'uid':uid
					},
				);
				console.log(res)
			}
		}catch(err){

		}
		setFront(true);
		if(parseInt(pid)==2){
			localStorage.setItem(
				'pid',
				JSON.stringify({pid:3})
			);
		}
		
	}


	
	let element=null;

	if(school=="school"){
		element=(
			<Input element="input" type="text" label="Class of Student" 
			validators={[VALIDATOR_REQUIRE()]}
			id="cls"
			placeholder="Class of Student"
			errorText="Please enter class"
			onInput={formInputHandler} />
		);
	}else{
		element=null;
	}

	let component=null;

	if(front){
		component=<Residence go="update"/>;
	}else if(back){
		component=<Personal go="update"/>;
	}else if(props.go && parseInt(pid)>=3){
		if(user && user.Type_of_Institute){
			component=(
				<form className="form" onSubmit={nextHandle}>
				<h1><center>Loan Details</center></h1>
				<hr/>
				<Input element="input" type="text" label="Institute name"
				id="inst_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Institute name" 
				errorText="Please enter institute name"
				onInput={formInputHandler}
				initvalue={user.Institute_Name}
				initvalid={true} />

				<div className="form-control" onChange={setSchoolHandler}>
					<label>Type Of Institute</label>
		        	<input type="radio" value="School" checked={school==="School"} defaultChecked name="sch"/>School
		        	<input type="radio" value="Other" checked={school==="Other"} name="sch"/>Other
		      	</div>

				<Input element="input" type="text" label="Location of Institute"
				id="loc" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Location"
				errorText="Please enter location of institute"
				onInput={formInputHandler}
				initvalue={user.Location_of_Institute}
				initvalid={true} />

				{element}

				<Input element="input" type="text" label="Course Name" 
				validators={[VALIDATOR_REQUIRE()]}
				id="c_name"
				placeholder="Course Name"
				errorText="Please enter course name"
				onInput={formInputHandler}
				initvalue={user.Course_Name}
				initvalid={true} />

				<Input element="input" type="number" label="Course Tenure (months)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="tenure"
				placeholder="0"
				errorText="Course tenure must be a positive number"
				onInput={formInputHandler}
				initvalue={user.Course_Tenure}
				initvalid={true} />

				<Input element="input" type="number" label="Course Fee Amount" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="amount"
				placeholder="0"
				errorText="Amount must not be empty and a positive number"
				onInput={formInputHandler}
				initvalue={user.Course_Fee_Amount}
				initvalid={true} /> 

				<Input element="input" type="number" label="Amount of financing required (Rs.)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="amount_fn"
				placeholder="0"
				errorText="Amount must not be empty and a positive number"
				onInput={formInputHandler}
				initvalue={user.financing_required}
				initvalid={true} />

				<Input element="input" type="number" label="Loan Tenure (months)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="loan_tenure"
				placeholder="0"
				errorText="Loan tenure must be a positive number"
				onInput={formInputHandler}
				initvalue={user.Loan_Tenure}
				initvalid={true} />

				<button onClick={backHandle}>Back</button>
				<button type="submit" disabled={!formState.isValid}>Next</button> 

				</form>
			);
		}
		}else{
			component=(
				<form className="form" onSubmit={nextHandle}>
				<h1><center>Loan Details</center></h1>
				<hr/>
				<Input element="input" type="text" label="Institute name"
				id="inst_name" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Institute name" 
				errorText="Please enter institute name"
				onInput={formInputHandler} />

				<div className="form-control" onChange={setSchoolHandler}>
					<label>Type Of Institute</label>
		        	<input type="radio" value="school" defaultChecked name="sch"/>School
		        	<input type="radio" value="other" name="sch"/>Other
		      	</div>

				<Input element="input" type="text" label="Location of Institute"
				id="loc" 
				validators={[VALIDATOR_REQUIRE()]}
				placeholder="Location"
				errorText="Please enter location of institute"
				onInput={formInputHandler} />

				{element}

				<Input element="input" type="text" label="Course Name" 
				validators={[VALIDATOR_REQUIRE()]}
				id="c_name"
				placeholder="Course Name"
				errorText="Please enter course name"
				onInput={formInputHandler} />

				<Input element="input" type="number" label="Course Tenure (months)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="tenure"
				placeholder="0"
				errorText="Course tenure must be a positive number"
				onInput={formInputHandler} />

				<Input element="input" type="number" label="Course Fee Amount" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="amount"
				placeholder="0"
				errorText="Amount must not be empty and a positive number"
				onInput={formInputHandler} /> 

				<Input element="input" type="number" label="Amount of financing required (Rs.)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="amount_fn"
				placeholder="0"
				errorText="Amount must not be empty and a positive number"
				onInput={formInputHandler} />

				<Input element="input" type="number" label="Loan Tenure (months)" 
				validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
				id="loan_tenure"
				placeholder="0"
				errorText="Loan tenure must be a positive number"
				onInput={formInputHandler} />

				<button onClick={backHandle}>Back</button>
				<button type="submit" disabled={!formState.isValid}>Next</button> 

				</form>
			);
		}
		


	return (
		<div>
			{component}
		</div>
	);
};

export default LoanDetails;