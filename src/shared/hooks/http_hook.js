import {useState,useCallback,useRef,useEffect} from 'react';

export const useHttp=()=>{
	const [loading,setLoading]=useState(false);
	const [error,setError]=useState();
	const activeReq=useRef([]);

	const sendReq=useCallback(async (url,method='GET',body=null,headers={})=>{
		setLoading(true);
		console.log("check1");
		//const httpAbort=new AbortController();
		//activeReq.current.push(httpAbort);
		console.log("check1");
		try{
			const response=await fetch(url,{
				method: method,
				body: body,
				headers: headers
				//signal: httpAbort.signal,
			});

			const responseData=await response.json();

			//activeReq.current=activeReq.current.filter(reqCtrl=>reqCtrl!==httpAbort);
			console.log(response);
			if(!response.ok){
				throw new Error(responseData.message);
			}
			setLoading(false);
			return responseData;
		}catch(err){
			console.log(err);
			setError(err.message)
			setLoading(false);
			throw err;
		}
	},[]);

	const clearError=()=>{
		setError(null);
	};

	/*useEffect(()=>{
		return ()=>{
			activeReq.current.forEach(abortCtrl=>abortCtrl.abort());
		};
	},[]);*/
	console.log(error);
	return {
		loading,
		error,
		sendReq,
		clearError
	};
};
