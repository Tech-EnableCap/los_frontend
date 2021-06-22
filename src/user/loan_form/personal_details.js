import React,{useState,useRef,useEffect} from 'react';
import './form.css';
import '../../shared/components/formelements/input.css';
import Form from './form';
import {useForm} from '../../shared/hooks/form_hook';
import Input from '../../shared/components/formelements/input';
import {VALIDATOR_REQUIRE} from '../../shared/util/validator';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import LoanDetails from './loan_details';
import {useHttp} from '../../shared/hooks/http_hook';


const Personal=(props)=>{
	let uid=null;
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const [back,setBack]=useState(false);
	const [front,setFront]=useState(false);
	const [gender,setGender]=useState("Male");
	const [marital,setMarital]=useState("Unmarried");
	const [date,setDate]=useState(null);
	const [valid,setValid]=useState(false)
	const nodeRef=useRef(null);
	const [user,setUser]=useState(null);
	const {loading,error,sendReq,clearError}=useHttp();
	/*const [formState,formInputHandler,setFormData]=useForm(
		{
			first_name:{
				value:'',
				isValid:false
			},
			last_name:{
				value:'',
				isValid:false
			},
		},false
	)*/
	const backHandle=()=>{
		setBack(true);
		setFront(false);
	};
	const frontHandle=()=>{
		setFront(true);
		setBack(false);
	};
	const handleDate=(date)=>{
		setDate(date);
		setValid(true);
	};
	const setGenderHandler=(event)=>{
		setGender(event.target.value);
	};
	const setMaritalHandler=(event)=>{
		setMarital(event.target.value);
	};

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
					if(res.msg.success.data.gender){
						setGender(res.msg.success.data.gender);
					}if(res.msg.success.data.marital_status){
						setMarital(res.msg.success.data.marital_status);
					}
				}
			}catch(err){

			}	
		}
		getUser();
	},[sendReq]);


	const nextHandle=async (event)=>{
		console.log(date);
		event.preventDefault();
		try{
			let converted_date=date.toLocaleDateString('en-GB',{
  				day:'numeric',
  				month:'short',
  				year:'numeric'
  			}).replace(/ /g,'-');
  			console.log(converted_date);
  			const storedId=JSON.parse(localStorage.getItem('id'));
			if(storedId){
				uid=storedId.uid;
			}
			if(uid){
				const res=await sendReq('http://localhost:5000/form2',
					'POST',
					JSON.stringify({
						data:{
							gender:gender,
							loan_app_dob:converted_date,
							marital_status:marital
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
		if(parseInt(pid)==1){
			localStorage.setItem(
				'pid',
				JSON.stringify({pid:2})
			);
		}
		
	}

	//if(date){
		//let dd=String(date.getDate()).padStart(2,'0');
		//let mmm=String(date.getMonth()+1).padStart(2,'0')
		//let yyyy=date.getFullYear();
		//let converted_date=dd+"-"+mmm+"-"+yyyy;
		//console.log(converted_date);
	//}

	let element=null;

	if(front){
		element=<LoanDetails go="update"/>
	}else if(back){
		element=<Form go="update"/>
	}else if(props.go && parseInt(pid)>=2){
		console.log(pid)
		console.log("here");
		if(user && user.loan_app_dob){
			console.log("no here");
			let dt=null;
			if(user.loan_app_dob){
				dt=new Date(user.loan_app_dob);
			}
			element=(
				<form className="form" onSubmit={nextHandle}>
			
				<h1><center>Personal Details</center></h1>
				<hr/>

				<div className="form-control">
				<label>DOB</label>
					<DatePicker className="form-control"  selected={dt ? dt : null}
					placeholderText="Click here to select dob"
					onChange={handleDate}
					dateFormat="dd/MM/yyyy"
					showYearDropdown
					nodeRef={nodeRef}
					scrollableMonthYearDropdown />
				</div>

				<div className="form-control" onChange={setGenderHandler}>
					<label>Gender</label>
		        	<input type="radio" value="Male" checked={gender==="Male"} defaultChecked name="gender"/>Male
		        	<input type="radio" value="Female" checked={gender==="Female"} name="gender"/>Female
		        	<input type="radio" value="3rd" name="gender"/>I dont want to disclose
		      	</div>

		      	<div className="form-control" onChange={setMaritalHandler}>
					<label>Marital Status</label>
		        	<input type="radio" value="Unmarried" checked={marital==="Unmarried"} defaultChecked name="marital"/>Unmarried
		        	<input type="radio" value="Married" checked={marital==="Married"} name="marital"/>Married
		        	<input type="radio" value="Divorced" checked={marital==="Divorced"} name="marital"/>Divorced
		      	</div>

		

			<button onClick={backHandle}>Back</button>
			<button type="submit">Next</button>

			</form> 
			);
		}
		}else{
			console.log("in this part");
			element=(
				<form className="form" onSubmit={nextHandle}>
			
				<h1><center>Personal Details</center></h1>
				<hr/>

				<div className="form-control">
				<label>DOB</label>
					<DatePicker className="form-control"  selected={date}
					placeholderText="Click here to select dob"
					onChange={handleDate}
					dateFormat="dd/MM/yyyy"
					showYearDropdown
					nodeRef={nodeRef}
					scrollableMonthYearDropdown />
				</div>

				<div className="form-control" onChange={setGenderHandler}>
					<label>Gender</label>
		        	<input type="radio" value="Male" defaultChecked name="gender"/>Male
		        	<input type="radio" value="Female" name="gender"/>Female
		        	<input type="radio" value="3rd" name="gender"/>I dont want to disclose
		      	</div>

		      	<div className="form-control" onChange={setMaritalHandler}>
					<label>Marital Status</label>
		        	<input type="radio" value="Unmarried" defaultChecked name="marital"/>Unmarried
		        	<input type="radio" value="Married" name="marital"/>Married
		        	<input type="radio" value="Divorced" name="marital"/>Divorced
		      	</div>

		

			<button onClick={backHandle}>Back</button>
			<button type="submit" disabled={!valid}>Next</button>

			</form> 
		);
		}	
	

	return(
		<div>
			{element}
		</div>
	);
};

export default Personal;

