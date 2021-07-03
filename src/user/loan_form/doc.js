import React,{useEffect,useState} from 'react';
import './form.css';
import ImagePicker from '../../shared/components/formelements/image_picker';
import {useForm} from '../../shared/hooks/form_hook';
import {useHttp} from '../../shared/hooks/http_hook';
import WorkDetails from './work_details';
import Loader from '../../ui/loader.js';
import Err from '../../ui/error.js';
import Button from '../../ui/button';
import UserStatus from '../../shared/components/status/user_status';
import Status from '../../shared/components/status/status';

const DocUpload=(props)=>{
	let uid=null;
	let pid=null;
	let did=null;
	let res=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const {loading,error,sendReq,clearError}=useHttp();
	const [user,setUser]=useState(null);
	const [back,setBack]=useState(false);
	const [err,setErr]=useState(false);
	const [formState,inputHandler,setFormData]=useForm(
		{
			image1:{
				value:null,
				isValid:false
			},
			image2:{
				value:null,
				isValid:false
			},
			image3:{
				value:null,
				isValid:false
			},
			image4:{
				value:null,
				isValid:false
			}
		},false
	);

	useEffect(()=>{
		const getUser=async ()=>{
			try{
				const storedId=JSON.parse(localStorage.getItem('did'));
				if(storedId){
					uid=storedId.did;
					res=await sendReq("http://localhost:5000/getUserdocs",
						"GET",
						null,
						{
							'uid':uid,
							"cors":"no-cors"
						}
					);
					console.log(res);
					if("success" in res.msg){
						if("data" in res.msg.success){
							if(res.msg.success.data.aadhar_back_img != "" || 
								res.msg.success.data.aadhar_frnt_img != "" || 
								res.msg.success.data.pan_card_img != "" || 
								res.msg.success.data.selfie_img != ""){
								console.log("herer");
								setUser(res.msg.success);
								setFormData({
									image1:{
										value:"https://creator.zoho.in"+res.msg.success.data.selfie_img,
										isValid:true
									},
									image2:{
										value:"https://creator.zoho.in"+res.msg.success.data.pan_card_img,
										isValid:true
									},
									image3:{
										value:"https://creator.zoho.in"+res.msg.success.data.aadhar_frnt_img,
										isValid:true
									},
									image4:{
										value:"https://creator.zoho.in"+res.msg.success.data.aadhar_frnt_img,
										isValid:true
									}
								},true);
								console.log(user);
							}
						}else{
							setErr("server error");
						}
					}else{
						setErr("server error");
					}
				}
			}catch(err){

			}
		}
		getUser();
	},[sendReq]);

	const clean=()=>{
		setErr(false);
	};

	const nextHandle=async (event)=>{
		event.preventDefault();
		console.log(formState.inputs);
		try{
			const storedId=JSON.parse(localStorage.getItem('id'));
			if(storedId){
				uid=storedId.uid;
			}
			if(uid){
				const storedId=JSON.parse(localStorage.getItem('did'));
				if(storedId){
					did=storedId.did;
				}
				console.log(did);
				const formData=new FormData();
				formData.append("image1",formState.inputs.image1.value);
				formData.append("image2",formState.inputs.image2.value);
				formData.append("image3",formState.inputs.image3.value);
				formData.append("image4",formState.inputs.image4.value);
				res=await sendReq('http://localhost:5000/form4',
					'POST',
					formData,
					{
						'uid':did,
						"cors":"no-cors"
					},
				);
				console.log(res)
				//console.log(formData)
				if("success" in res.msg){
					if(res.msg.success==="successfully uploaded"){
						alert("your application is saved, thanks!!");
						window.location.reload();
						if(parseInt(pid)==5){
							localStorage.setItem(
								'pid',
								JSON.stringify({pid:6})
							);
						}
					}
				}else{
					setErr("server error");
				}
			}
		}catch(err){
			console.log(err);
		}
	};

	const backHandle=()=>{
		setBack(true);
	};

	const reloadHandle=()=>{
		window.location.reload();
	};


	let component=null;

	if(back){
		component=<WorkDetails go="update"/>
	}else if(loading){
		component=<Loader asOverlay />
	}else if(props.go && parseInt(pid)>=6){
		if(user){
			component=(
				<React.Fragment>
				<Status status={pid}/>
				<form className="form" onSubmit={nextHandle}>
				
				<h1><center>Documents upload</center></h1>
				<hr/>
				<div className="form-control">
					<p><strong>Please upload passport pic</strong></p>
					<ImagePicker center id="image1" image={formState.inputs.image1.value} onInput={inputHandler}/>
				</div>
				<div className="form-control">
					<p><strong>Please select PAN card</strong></p>
					<ImagePicker center id="image2" image={`https://creator.zoho.in${user.data.pan_card_img}`} onInput={inputHandler}/>
				</div>
				<div className="form-control">
					<p><strong>Please select front side of AADHAR card</strong></p>
					<ImagePicker center id="image3" image={`https://creator.zoho.in${user.data.aadhar_frnt_img}`} onInput={inputHandler}/>
				</div>
				<div className="form-control">
					<p><strong>Please select back side of AADHAR card</strong></p>
					<ImagePicker center id="image4" image={`https://creator.zoho.in${user.data.aadhar_back_img}`} onInput={inputHandler}/>
				</div>
				<Button onClick={backHandle}>Back</Button>
				<Button type="submit" disabled={!formState.isValid}>Done</Button>
				</form>
				</React.Fragment>
			);
		}else{
			component=<UserStatus err={true} reload={reloadHandle}/>;
		}
	}else{
		component=(
			<React.Fragment>
			<Status status={pid}/>
			<form className="form" onSubmit={nextHandle}>
			
			<h1><center>Documents upload</center></h1>
			<hr/>
			<div className="form-control">
				<p><strong>Please upload passport pic</strong></p>
				<ImagePicker center id="image1" onInput={inputHandler}/>
			</div>
			<div className="form-control">
				<p><strong>Please select PAN card</strong></p>
				<ImagePicker center id="image2" onInput={inputHandler}/>
			</div>
			<div className="form-control">
				<p><strong>Please select front side of AADHAR card</strong></p>
				<ImagePicker center id="image3" onInput={inputHandler}/>
			</div>
			<div className="form-control">
				<p><strong>Please select back side of AADHAR card</strong></p>
				<ImagePicker center id="image4" onInput={inputHandler}/>
			</div>
			<Button onClick={backHandle}>Back</Button>
			<Button type="submit" disabled={!formState.isValid}>Done</Button>
			</form>
			</React.Fragment>
		)
	}

	return(
		<div>
			{loading && <Loader asOverlay />}
			<Err error={error} onClear={clearError}/>
			<Err error={err} onClear={clean}/>
			{component}
		</div>
	)
};

export default DocUpload;