import React from 'react';
import './status.css';
import logo from '../../../Man-Using-Computer.svg';
import {Link} from 'react-router-dom';
import Button from '../../../ui/button';

const userStatus=(props)=>{
	let element=null;
	let st_list=["Authentication done","Personal information filled","Loan details filled","Residence details filled","Work details filled","Documents upload done"];
	let st_data=[];
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	if(pid){
		for (let i=0;i<st_list.length;i++){
			if(i>pid-1){
				break;
			}
			st_data.push(<><div className="status" key={i}>
					<div className="side" style={{background: "gray"}}><i class="fa fa-check" aria-hidden="true"></i></div>
					{st_list[i]}
				</div>
				<hr/></>);
		}
		if(pid<st_list.length){
			for (let i=pid;i<st_list.length;i++){
				st_data.push(<><div className="status" key={i}>
						<div className="side"><i class="fa fa-times" aria-hidden="true"></i></div>
						{st_list[i]}
					</div>
					<hr/></>);
			}
		}
		element=(<div className="form1">
				<h1><center>Applicant's status</center></h1>
				<hr/>
				{st_data}
				<Link to="/form" className="button">Go to Form</Link>
			 </div>);
	}else{
		element=(<div className="no-applications">
		<img src={logo} className="logo" alt="logo"/>
			<div className="help-text">
				{props.err ? "Server error, just don't panic !" : "Fill application form and view status"}
			</div>
			<div className="help-text">
				{props.err ? <Button onClick={props.reload}>Retry</Button> : <Link to="/form" className="btn btn-primary">Apply for loan</Link>}
			</div>
		</div>);
	}
	return(
			element 
		);
	
};

export default userStatus;