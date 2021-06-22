import React,{useEffect,useState} from 'react';
import './form.css';
import ImagePicker from '../../shared/components/formelements/image_picker';
import {useForm} from '../../shared/hooks/form_hook';
import {useHttp} from '../../shared/hooks/http_hook';
import WorkDetails from './work_details';

const DocUpload=(props)=>{
	let uid=null;
	let pid=null;
	let did=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	const {loading,error,sendReq,clearError}=useHttp();
	const [user,setUser]=useState(null);
	const [back,setBack]=useState(false);
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
					const res=await sendReq("http://localhost:5000/getUserdocs",
						"GET",
						null,
						{
							'uid':uid
						}
					);
					console.log(res);
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
					},true)
				}
			}catch(err){

			}
		}
		getUser();
	},[sendReq]);

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
				const res=await sendReq('http://localhost:5000/form4',
					'POST',
					formData,
					{
						'uid':did
					},
				);
				console.log(res)
				//console.log(formData)
			}
		}catch(err){
			console.log(err);
		}
		if(parseInt(pid)==5){
			localStorage.setItem(
				'pid',
				JSON.stringify({pid:6})
			);
		}
		alert("you have uploaded all documents");
	};

	const backHandle=()=>{
		setBack(true);
	};

	let component=null;
	if(back){
		component=<WorkDetails go="update"/>
	}else if(props.go && parseInt(pid)>=6){
		if(user){
			component=(
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
				<button onClick={backHandle}>Back</button>
				<button type="submit" disabled={!formState.isValid}>Next</button>
				</form>
			);
		}
	}else{
		component=(
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
			<button onClick={backHandle}>Back</button>
			<button type="submit" disabled={!formState.isValid}>Next</button>
			</form>
		)
	}

	return(
		<div>
			{component}
		</div>
	)
};

export default DocUpload;