import React,{useState,useEffect} from 'react';
import './form.css';
import Input from '../../shared/components/formelements/input';
import {VALIDATOR_REQUIRE,VALIDATOR_EMAIL,VALIDATOR_PHONE,VALIDATOR_NUMBER} from '../../shared/util/validator';
import Personal from './personal_details';
import {useForm} from '../../shared/hooks/form_hook';
import {useHttp} from '../../shared/hooks/http_hook';
/*import axios from 'axios'; */
import Loader from '../../ui/loader.js';
import Err from '../../ui/error.js';
import Button from '../../ui/button';
//import UserStatus from '../../shared/components/status/user_status';
import '../../shared/components/status/status.css';

const Coapp=(props)=>{
	let res=null;
	let component=null;
	const {loading,error,sendReq,clearError}=useHttp();
	const [err,setErr]=useState(false);
	const [details,getDetails]=useState(null);
	const [checked,setChecked]=useState(false);
	const [formState,formInputHandler,setFormData]=useForm(
		{
			lid:{
				value:'',
				isValid:false
			}
		},false
	);

	const [formState1,formInputHandler1,setFormData1]=useForm(
		{
			phone:{
				value:'',
				isValid:false
			}
		},false
	);


	const clean=()=>{
		setErr(false);
	}

	const checkHandler=()=>{
		setChecked((prev)=>!prev);
		if(!checked){

			setFormData(
				{
					...formState.inputs,
				},
				formState.isValid
			);
		}
		
	};

	const cancelHandler=()=>{
		getDetails(null);
	}

	const getFormHandler=()=>{
		window.location.href="http://localhost:4000/"+details[0].lid+"/form";
	}


	const nextHandle=async (event)=>{
		event.preventDefault();
		try{
			res=await sendReq('http://localhost:5000/getapplicant',
				'POST',
				JSON.stringify({
					data:{
						lid:formState.inputs.lid.value,
						phone:formState1.inputs.phone.value
					}
				}),
				{
					'Content-Type':'application/json',
					"cors":"no-cors"
				},
			);
			console.log(res.msg.success);
			if(res.msg){
				if(res.msg.success.code===3000){
					getDetails(res.msg.success.data);
				}else{
					setErr("no data found");
				}
			}else{
				setErr("server error");
			}
			
		}catch(err){
			console.log("Server Error "+err);
		}
			
	};


	if(loading){
		component=<Loader asOverlay />
	}else{
		component=(
			<React.Fragment>
			<div className="form1" style={{background:"#d1d3d4"}}>
			<div className="card" style={{boxShadow: "0px 1px 5px 0px rgb(0 0 0 / 92%)"}}>
 
			  <div className="card-body">
			    <h5 className="card-title" style={{textAlign:"center"}}>Step1: Search by applicant's Loan ID or Phone</h5><hr/>
			    <h5 className="card-title" style={{textAlign:"center"}}>Step2: Check applicant's data</h5><hr/>
			    <h5 className="card-title" style={{textAlign:"center"}}>Step3: Click confirm and get the form </h5>
			  </div>
			</div>

				{!details ? (<><form className="form1" style={{margin:"1rem auto",boxShadow: "0px 1px 5px 0px rgb(0 0 0 / 92%)"}} onSubmit={nextHandle}>
					<h1><center>Applicant by Loan Id</center></h1>
					<hr/>

					<Input element="input" type="text" label="Enter applicant's Loan ID" 
					validators={[VALIDATOR_REQUIRE()]}
					id="lid"
					placeholder="Loan ID"
					errorText="enter loan id"
					onInput={formInputHandler}
					initvalue={formState.inputs.lid.value}
					initvalid={formState.isValid} />


				<Button type="submit" disabled={!formState.isValid}>View Applicant Details</Button> 

				</form>
				<h1><center>Or</center></h1>
				<form className="form1" style={{margin:"1rem auto",boxShadow: "0px 1px 5px 0px rgb(0 0 0 / 92%)"}} onSubmit={nextHandle}>
					<h1><center>Applicant by Phone</center></h1>
					<hr/>

					<Input element="input" type="phone" label="Enter applicant's phone number" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_PHONE()]}
					id="phone"
					placeholder="Phone"
					errorText="enter applicant's phone number"
					onInput={formInputHandler1}
					initvalue={formState1.inputs.phone.value}
					initvalid={formState1.isValid} />


				<Button type="submit" disabled={!formState1.isValid}>View Applicant Details</Button> 

				</form></>) : (<><div className="card" style={{margin:"1rem auto",boxShadow: "0px 1px 5px 0px rgb(0 0 0 / 92%)"}}>
 								 <h5 style={{fontWeight:"bold",textAlign:"center",padding:"2rem"}}>Applicant details</h5>
			  <div className="card-body" style={{background:"#b6c0c4"}}>
			    <h5 className="card-title" style={{fontWeight:"bold",textAlign:"center"}}>Name : {details[0].app_Name.display_value}</h5><hr/>
			    <h5 className="card-title" style={{fontWeight:"bold",textAlign:"center"}}>Phone : {details[0].Applicant_Phone}</h5><hr/>
			    <h5 className="card-title" style={{fontWeight:"bold",textAlign:"center"}}>Institute name : {details[0].Institute_Name}</h5><hr/>
			    <h5 className="card-title" style={{fontWeight:"bold",textAlign:"center"}}>Financing required : {details[0].Financing_Requirement}</h5><hr/>
			    <h5 className="card-title" style={{fontWeight:"bold",textAlign:"center"}}>Coapplicant required : {details[0].Co_Applicant_Reqiured==="" ? "No" : "Yes"}</h5>
			    
			  </div>

			</div>
			<div style={{padding:"20px",fontSize:"20px"}}>
			<label>
		      <input type="checkbox" style={{margin:"10px"}} defaultChecked={checked} onChange={checkHandler} />I Confirm
		    </label>
		    </div>
			<Button disabled={!checked || (details[0].Co_Applicant_Reqiured==="" ? true : false)} onClick={getFormHandler}>Get Form</Button>
			<Button onClick={cancelHandler}>Cancel</Button></>)}
			</div>
			
			</React.Fragment>

		);
	}


	return(
		<React.Fragment>
			{loading && <Loader asOverlay />}
			<Err error={error} onClear={clearError}/>
			<Err error={err} onClear={clean}/>
			{component}
		</React.Fragment>
	);
};

export default Coapp;
