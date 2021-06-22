import React from 'react';
import './status.css';

const Status=(props)=>{
	let element=null;
	console.log("ddcvb");
	console.log(props.status);
	if(!props){
		console.log("mngh");
	}
	if(props.status){
		if(parseInt(props.status)===1){
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side"><i class="fas fa-user"></i></div> >
				<div className="side"><i class="fas fa-coins"></i></div> >
				<div className="side"><i class="fas fa-landmark"></i></div> >
				<div className="side"><i class="fas fa-keyboard"></i></div> >
				<div className="side"><i class="fas fa-id-card-alt"></i></div>
				</div>
			);
		}if(parseInt(props.status)===2){
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-user"></i></div> >
				<div className="side"><i class="fas fa-coins"></i></div> >
				<div className="side"><i class="fas fa-landmark"></i></div> >
				<div className="side"><i class="fas fa-keyboard"></i></div> >
				<div className="side"><i class="fas fa-id-card-alt"></i></div>
				</div>
			);
		}if(parseInt(props.status)===3){
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-user"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-coins"></i></div> >
				<div className="side"><i class="fas fa-landmark"></i></div> >
				<div className="side"><i class="fas fa-keyboard"></i></div> >
				<div className="side"><i class="fas fa-id-card-alt"></i></div>
				</div>
			);
		}if(parseInt(props.status)===4){
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-user"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-coins"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-landmark"></i></div> >
				<div className="side"><i class="fas fa-keyboard"></i></div> >
				<div className="side"><i class="fas fa-id-card-alt"></i></div>
				</div>
			);
		}if(parseInt(props.status)===5){
			console.log("here")
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-user"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-coins"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-landmark"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-keyboard"></i></div> >
				<div className="side"><i class="fas fa-id-card-alt"></i></div>
				</div>
			);
		}if(parseInt(props.status)===6){
			console.log("here")
			element=(
				<div className="status">
				<div className="side" style={{background: "gray"}}><i class="fas fa-user-check"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-user"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-coins"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-landmark"></i></div> >
				<div className="side" style={{background: "gray"}}><i class="fas fa-keyboard"></i></div>
				<div className="side" style={{background: "gray"}}><i class="fas fa-id-card-alt"></i></div> 
				</div> 
			);
		}
	}if(!props.status){
		console.log("kkdj");
		element=(
			<div className="status">
			<div className="side"><i class="fas fa-user-check"></i></div> >
			<div className="side"><i class="fas fa-user"></i></div> >
			<div className="side"><i class="fas fa-coins"></i></div> >
			<div className="side"><i class="fas fa-landmark"></i></div> >
			<div className="side"><i class="fas fa-keyboard"></i></div> >
			<div className="side"><i class="fas fa-id-card-alt"></i></div>
			</div>
		);
	}
	return(
		<div className="form1">
			{element}
		</div>
	);
};

export default Status;
