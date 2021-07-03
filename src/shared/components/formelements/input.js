import React,{useReducer,useEffect} from 'react';
import {validate} from '../../util/validator';
import './input.css';

const inputReducer=(state,action)=>{
	switch(action.type){
		case 'CHANGE':
			return {
				...state,
				value:action.val,
				isValid:validate(action.val,action.validators)
			};
		case 'BLUR':
			return {
				...state,
				isTouched:true
			}
		default:
			return state;
	}
};

const Input=(props)=>{

	const [inputState,dispatch]=useReducer(inputReducer,{
												value:props.initvalue || '',
												isTouched:false,
												isValid:props.initvalid || false
											});

	const {id,onInput}=props;
	const {value,isValid}=inputState;

	useEffect(()=>{
		onInput(id,value,isValid)
	},[id,value,isValid,onInput]);

	const changedHandler=(event)=>{
		dispatch({
			type:"CHANGE",
			val:event.target.value,
			validators:props.validators
		})
	};

	const blurHandler=(event)=>{
		dispatch({
			type:'BLUR'
		});
	};

	const element=props.element==='input' ? (<input id={props.id}
	type={props.type} 
	placeholder={props.placeholder}
	disabled={props.disable}
	onChange={changedHandler}
	onBlur={blurHandler}
	value={inputState.value} />) : (<textarea id={props.id} 
	rows={props.rows || 3}
	disabled={props.disable ? props.disable : false}
	onChange={changedHandler}
	onBlur={blurHandler}
	value={inputState.value} />);


	return(
		<div className={`form-control ${!inputState.isValid && inputState.isTouched && 
			"form-control--invalid"}`}>
			<label htmlFor={props.id}>{props.label}</label>
			{element}
			{!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
		</div>
	)
};

export default Input;