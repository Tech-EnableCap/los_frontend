import React from 'react';
import {BrowserRouter as Router,Route,Switch,} from 'react-router-dom';
import Navigation from './shared/components/navigation/navigation';
import Form from './user/loan_form/form';
import Personal from './user/loan_form/personal_details';
import LoanDetails from './user/loan_form/loan_details';
import Residence from './user/loan_form/residence';
import WorkDetails from './user/loan_form/work_details';
import DocUpload from './user/loan_form/doc';
import Status from './shared/components/status/status';

function App() {
	let pid=null;
	const pId=JSON.parse(localStorage.getItem('pid'));
	if(pId){
		pid=pId.pid;
	}
	let element=null;
	if(pid){
		if(parseInt(pid)==1){
			element=<Form go="update"/>
		}if(parseInt(pid)==2){
			element=<Personal go="update"/>
		}if(parseInt(pid)==3){
			element=<LoanDetails go="update"/>
		}if(parseInt(pid)==4){
			element=<Residence go="update"/>
		}if(parseInt(pid)==5){
			element=<WorkDetails go="update"/>
		}if(parseInt(pid)==6){
			element=<DocUpload go="update"/>
		}
	}else{
		element=<Form/>
	}
  return (
    <Router>
      <Navigation/>
      <Status status={pid}/>
      <Route path="/form" exact>
        {element}
      </Route>
    </Router>
  );
}

export default App;
