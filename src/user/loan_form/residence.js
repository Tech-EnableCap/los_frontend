import React,{useState,useCallback,useEffect} from 'react';
import './form.css';
import '../../shared/components/formelements/input.css';
import Form from './form';
import {useForm} from '../../shared/hooks/form_hook';
import Input from '../../shared/components/formelements/input';
import {VALIDATOR_REQUIRE,VALIDATOR_NUMBER,VALIDATOR_POSITIVE} from '../../shared/util/validator';
import LoanDetails from './loan_details';
import {useHttp} from '../../shared/hooks/http_hook';
import WorkDetails from './work_details';

const Residence=(props)=>{
	let uid=null;
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const [resi,setResi]=useState("Owned");
	const [rent,setRent]=useState("Family");
	const [own,setOwn]=useState("Self");
	const [checked,setChecked]=useState(false);
	const [back,setBack]=useState(false);
	const [front,setFront]=useState(false);
	const [user,setUser]=useState(null);
	const {loading,error,sendReq,clearError}=useHttp();
	const [formState,formInputHandler,setFormData]=useForm(
		{
			address:{
				value:'',
				isValid:false
			},
			city:{
				value:'',
				isValid:false
			},
			state:{
				value:'',
				isValid:false
			},
			postal:{
				value:'',
				isValid:false
			}
		},false
	);

	const [formState1,formInputHandler1,setFormData1]=useForm(
		{
			address1:{
				value:'',
				isValid:false
			},
			city1:{
				value:'',
				isValid:false
			},
			state1:{
				value:'',
				isValid:false
			},
			postal1:{
				value:'',
				isValid:false
			}
		},false
	);

	const [formState2,formInputHandler2,setFormData2]=useForm(
		{
			month_rent:{
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
					if(res.msg.success.data.res_status){
						setResi(res.msg.success.data.res_status);
					}if(res.msg.success.data.rented_by){
						setRent(res.msg.success.data.rented_by);
					}if(res.msg.success.data.owned_by){
						setOwn(res.msg.success.data.owned_by);
					}

					setFormData({
						...formState.inputs,
						address:{
							value:res.msg.success.data.cur_res_addr.address_line_1,
							isValid:true
						},
						city:{
							value:res.msg.success.data.cur_res_addr.district_city,
							isValid:true
						},
						state:{
							value:res.msg.success.data.cur_res_addr.state_province,
							isValid:true
						},
						postal:{
							value:res.msg.success.data.cur_res_addr.postal_code,
							isValid:true
						}

					},true);

					setFormData1({
						...formState1.inputs,
						address1:{
							value:res.msg.success.data.per_res_addr.address_line_1,
							isValid:true
						},
						city1:{
							value:res.msg.success.data.per_res_addr.district_city,
							isValid:true
						},
						state1:{
							value:res.msg.success.data.per_res_addr.state_province,
							isValid:true
						},
						postal1:{
							value:res.msg.success.data.per_res_addr.postal_code,
							isValid:true
						}
					},true);

					setFormData2({
						month_rent:{
							value:res.msg.success.data.rent_amt,
							isValid:true
						}
					},true);
				}
			}catch(err){

			}	
		}
		getUser();
	},[sendReq]);


	

	const setResHandler=(event)=>{
		setResi(event.target.value);
	};

	const setRentHandler=(event)=>{
		setRent(event.target.value);
	};

	const setOwnHandler=(event)=>{
		setOwn(event.target.value);
	};

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

	const backHandle=()=>{
		setBack(true);
		setFront(false);
	};
	const frontHandle=()=>{
		setFront(true);
		setBack(false);
	};

	const nextHandle=async (event)=>{
		event.preventDefault();
		console.log("here");
		try{
  			const storedId=JSON.parse(localStorage.getItem('id'));
			if(storedId){
				uid=storedId.uid;
			}
			if(uid){
				console.log("jjj");
				const res=await sendReq('http://localhost:5000/form2',
					'POST',
					JSON.stringify({
						data:{
							cur_res_addr:{
								display_value:"",
								country:"India",
								district_city:formState.inputs.city.value,
								latitude:"",
								address_line_1:formState.inputs.address.value,
								state_province:formState.inputs.state.value,
								address_line_2:"",
								postal_code:formState.inputs.postal.value,
								longitude:""
							},
							res_status:resi,
							rented_by:rent,
							owned_by:own,
							rent_amt:formState2.inputs.month_rent.value,
							per_res_addr:{
								display_value:"",
								country:"India",
								district_city:formState1.inputs.city1.value,
								latitude:"",
								address_line_1:formState1.inputs.address1.value,
								state_province:formState1.inputs.state1.value,
								address_line_2:"",
								postal_code:formState1.inputs.postal1.value,
								longitude:""
							}
						}
					}),
					{
						'Content-Type':'application/json',
						'uid':uid
					},
				);
				console.log(res)
			}
		}
		catch(err) {
			console.log(err);
		} 
		setFront(true);
		if(parseInt(pid)==3){
			localStorage.setItem(
				'pid',
				JSON.stringify({pid:4})
			);
		}
		
	}



	let component=null;
	if(front){
		component=<WorkDetails go="update"/>;
	}else if(back){
		component=<LoanDetails go="update"/>;
	}else if(props.go && parseInt(pid)>=4){
		console.log("llllll")
		if(user && user.per_res_addr){
			console.log(user.per_res_addr)
			component=(
				<form className="form" onSubmit={nextHandle}>
					<h1><center>Residence Details</center></h1>
					<hr/>
					<div className="form-control">
					<Input element="textarea" label="Please enter your current residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address"
					placeholder="Course Name"
					errorText="Please enter your current residence address"
					onInput={formInputHandler}
					initvalue={user.cur_res_addr.address_line_1}
					initvalid={true} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city"
					placeholder="City"
					errorText="Please enter city"
					onInput={formInputHandler}
					initvalue={user.cur_res_addr.district_city}
					initvalid={true} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state"
					placeholder="State"
					errorText="Please enter state"
					onInput={formInputHandler}
					initvalue={user.cur_res_addr.state_province}
					initvalid={true} />

					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					onInput={formInputHandler}
					initvalue={user.cur_res_addr.postal_code}
					initvalid={true} />

					</div>

					<div className="form-control" onChange={setResHandler}>
						<label>Is your current residence</label>
			        	<input type="radio" value="Owned" checked={resi==="Owned"} defaultChecked name="res"/>Owned
			        	<input type="radio" value="Rented" checked={resi==="Rented"} name="res"/>Rented
			      	</div>

			      	<div className="form-control" onChange={setRentHandler}>
						<label>Rented By</label>
			        	<input type="radio" value="Family" checked={rent==="Family"} defaultChecked name="rent"/>Family
			        	<input type="radio" value="Friends" checked={rent==="Friends"} name="rent"/>Friends
			        	<input type="radio" value="Company Provided" checked={rent==="Company Provided"} name="rent"/>Company Provided
			        	<input type="radio" value="Self, Staying Alone" checked={rent==="Self, Staying Alone"} name="rent"/>Self, Staying Alone
			        	<input type="radio" value="Paying Guest" checked={rent==="Paying Guest"} name="rent"/>Paying Guest
			        	<input type="radio" value="Hostel" checked={rent==="Hostel"} name="rent"/>Hostel
			      	</div>

			      	<div className="form-control" onChange={setOwnHandler}>
						<label>Owned By</label>
			        	<input type="radio" value="Self" checked={own==="Self"} defaultChecked name="own"/>Owned
			        	<input type="radio" value="Spouse" checked={own==="Spouse"} name="own"/>Spouse
			        	<input type="radio" value="Parents" checked={own==="Parents"} name="own"/>Parents
			        	<input type="radio" value="Siblings" checked={own==="Siblings"} name="own"/>Siblings
			      	</div>

			      	<Input element="input" type="number" label="Monthly Rent" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="month_rent"
					placeholder="0"
					errorText="Enter monthly rent if any and amount will be valid positive number"
					onInput={formInputHandler2}
					initvalue={user.rent_amt}
					initvalid={true} />

					<div>
						<label>
					      <input type="checkbox" defaultChecked={checked} onChange={checkHandler}/> Copy my current address to permanent address
					    </label>
					</div>

					{checked ? 
					<div className="form-control">

					

					<Input element="textarea" label="Please enter your permanent residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address1"
					errorText="Please enter your current residence address"
					initvalue={formState.inputs.address.value ? formState.inputs.address.value : null}
					initvalid={formState.inputs.address.isValid}
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.address_line_11}
					initvalid={true} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city1"
					placeholder="City"
					errorText="Please enter city"
					initvalue={formState.inputs.city.value ? formState.inputs.city.value : null}
					initvalid={formState.inputs.city.isValid}
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.district_city1}
					initvalid={true} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state1"
					placeholder="State"
					errorText="Please enter state"
					initvalue={formState.inputs.state.value ? formState.inputs.state.value : null}
					initvalid={formState.inputs.state.isValid}
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.state_province1}
					initvalid={true} />

					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal1"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					initvalue={formState.inputs.postal.value ? formState.inputs.postal.value : null}
					initvalid={formState.inputs.postal.isValid}
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.postal_code1}
					initvalid={true} />


					</div> :

					<React.Fragment>
					<div className="form-control">

					<Input element="textarea" label="Please enter your permanent residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address1"
					errorText="Please enter your permanent residence address"
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.address_line_11}
					initvalid={true} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city1"
					placeholder="City"
					errorText="Please enter city"
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.district_city1}
					initvalid={true} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state1"
					placeholder="State"
					errorText="Please enter state"
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.state_province1}
					initvalid={true} />
					
					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal1"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					onInput={formInputHandler1}
					initvalue={user.per_res_addr.postal_code1}
					initvalid={true} />

					</div>
					</React.Fragment>
			

					}

					<button onClick={backHandle}>Back</button>
					<button type="submit" disabled={!formState.isValid || !formState1.isValid}>Next</button>

				</form>
			);
		}
	}else{
		component=(
				<form className="form" onSubmit={nextHandle}>
					<h1><center>Residence Details</center></h1>
					<hr/>
					<div className="form-control">
					<Input element="textarea" label="Please enter your current residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address"
					placeholder="Course Name"
					errorText="Please enter your current residence address"
					onInput={formInputHandler} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city"
					placeholder="City"
					errorText="Please enter city"
					onInput={formInputHandler} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state"
					placeholder="State"
					errorText="Please enter state"
					onInput={formInputHandler} />

					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					onInput={formInputHandler} />

					</div>

					<div className="form-control" onChange={setResHandler}>
						<label>Is your current residence</label>
			        	<input type="radio" value="owned" defaultChecked name="res"/>Owned
			        	<input type="radio" value="rented" name="res"/>Rented
			      	</div>

			      	<div className="form-control" onChange={setRentHandler}>
						<label>Rented By</label>
			        	<input type="radio" value="Family" defaultChecked name="rent"/>Family
			        	<input type="radio" value="Friends" name="rent"/>Friends
			        	<input type="radio" value="Company Provided" name="rent"/>Company Provided
			        	<input type="radio" value="Self, Staying Alone" name="rent"/>Self, Staying Alone
			        	<input type="radio" value="Paying Guest" name="rent"/>Paying Guest
			        	<input type="radio" value="Hostel" name="rent"/>Hostel
			      	</div>

			      	<div className="form-control" onChange={setOwnHandler}>
						<label>Owned By</label>
			        	<input type="radio" value="Self" defaultChecked name="own"/>Owned
			        	<input type="radio" value="Spouse" name="own"/>Spouse
			        	<input type="radio" value="Parents" name="own"/>Parents
			        	<input type="radio" value="Siblings" name="own"/>Siblings
			      	</div>

			      	<Input element="input" type="number" label="Monthly Rent" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="month_rent"
					placeholder="0"
					errorText="Enter monthly rent if any and amount will be valid positive number"
					onInput={formInputHandler2} />

					<div>
						<label>
					      <input type="checkbox" defaultChecked={checked} onChange={checkHandler}/> Copy my current address to permanent address
					    </label>
					</div>

					{checked ? 
					<div className="form-control">

					

					<Input element="textarea" label="Please enter your permanent residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address1"
					placeholder="Course Name"
					errorText="Please enter your current residence address"
					initvalue={formState.inputs.address.value ? formState.inputs.address.value : null}
					initvalid={formState.inputs.address.isValid}
					onInput={formInputHandler1} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city1"
					placeholder="City"
					errorText="Please enter city"
					initvalue={formState.inputs.city.value ? formState.inputs.city.value : null}
					initvalid={formState.inputs.city.isValid}
					onInput={formInputHandler1} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state1"
					placeholder="State"
					errorText="Please enter state"
					initvalue={formState.inputs.state.value ? formState.inputs.state.value : null}
					initvalid={formState.inputs.state.isValid}
					onInput={formInputHandler1} />

					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal1"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					initvalue={formState.inputs.postal.value ? formState.inputs.postal.value : null}
					initvalid={formState.inputs.postal.isValid}
					onInput={formInputHandler1} />


					</div> :

					<React.Fragment>
					<div className="form-control">

					<Input element="textarea" label="Please enter your permanent residence address" 
					validators={[VALIDATOR_REQUIRE()]}
					id="address1"
					placeholder="Course Name"
					errorText="Please enter your current residence address"
					onInput={formInputHandler1} />

					<Input element="input" type="text" label="Enter City" 
					validators={[VALIDATOR_REQUIRE()]}
					id="city1"
					placeholder="City"
					errorText="Please enter city"
					onInput={formInputHandler1} />

					<Input element="input" type="text" label="Enter State" 
					validators={[VALIDATOR_REQUIRE()]}
					id="state1"
					placeholder="State"
					errorText="Please enter state"
					onInput={formInputHandler1} />
					
					<Input element="input" type="number" label="Postal code" 
					validators={[VALIDATOR_REQUIRE(),VALIDATOR_NUMBER(),VALIDATOR_POSITIVE()]}
					id="postal1"
					placeholder="Postal code"
					errorText="Please enter proper postal code"
					onInput={formInputHandler1} />

					</div>
					</React.Fragment>
			

					}

					<button onClick={backHandle}>Back</button>
					<button type="submit" disabled={!formState.isValid || !formState1.isValid}>Next</button>

				</form>
			);
	}


	return (
		<React.Fragment>
			{component}
		</React.Fragment>
	);
};

export default Residence;