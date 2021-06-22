import React,{useRef,useState,useEffect} from 'react';
import './image_picker.css';
import './input.css';

const ImagePicker=(props)=>{
	const [file,setFile]=useState();
	const [preview,setPreview]=useState();
	const [valid,setValid]=useState(false);

	const imagePick=useRef();

	useEffect(()=>{
		if(!file){
			return;
		}
		const fileReader=new FileReader();
		fileReader.onload=()=>{
			setPreview(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	},[file]);

	const pickedHandler=(event)=>{
		let pickedFile;
		let fileValid=valid;
		if(event.target.files && event.target.files.length===1){
			pickedFile=event.target.files[0];
			setFile(pickedFile);
			setValid(true);
			fileValid=true;
		}else{
			setValid(false);
			fileValid=false;
		}
		props.onInput(props.id,pickedFile,fileValid);
	}

	const imageHandler=()=>{
		imagePick.current.click();
	}

	let element=null;
	if(preview){
		element=<img src={preview} alt="Preview"/>;
	}else if(props.image){
		element=<img src={props.image} alt="Preview"/>;
	}else if(!preview){
		element=<p>please pick image</p>
	}

	return(
		<div className="form-control">
			<input id={props.id}
			ref={imagePick}
			style={{display:'none'}} 
			type="file"
			onChange={pickedHandler}
			accept=".jpg,.png,.jpeg"/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className="image-upload__preview">
					{element}
				</div>
				<button type="button" onClick={imageHandler}>Pick Image</button>
			</div>
			{!valid && <p>{props.errorText}</p>}
		</div>
	);
};

export default ImagePicker;
