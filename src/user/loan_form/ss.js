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
{(props.payslip==="Salaried") ? (<><div className="form-control">
					<p><strong>Please upload last 3 months payslip</strong></p>
					<ImagePicker center id="image5" onInput={inputHandler}/>
					{mod.map((ele,idx)=>{
						return <div key={idx}>{ele}</div>
					})}
					<p onClick={addPayslipHandle}><i class="fa fa-plus" aria-hidden="true"></i></p>
				</div><div className="form-control">
					<p><strong>Please upload last 3 months salary a/c bank statement</strong></p>
					<ImagePicker center id="image8" onInput={inputHandler}/>
					{dom.map((ele,idx)=>{
						return <div key={idx}>{ele}</div>
					})}
					<p onClick={addStatementHandle}><i class="fa fa-plus" aria-hidden="true"></i></p>
				</div></>) : (<><div className="form-control">
					<p><strong>Please upload last 2 years ITR</strong></p>
					<ImagePicker center id="image5" onInput={inputHandler}/>
					{mod.map((ele,idx)=>{
						return <div key={idx}>{ele}</div>
					})}
					<p onClick={addPayslipHandle}><i class="fa fa-plus" aria-hidden="true"></i></p>
				</div><div className="form-control">
					<p><strong>Please upload last 3 months bank statement</strong></p>
					<ImagePicker center id="image8" onInput={inputHandler}/>
					{dom.map((ele,idx)=>{
						return <div key={idx}>{ele}</div>
					})}
					<p onClick={addStatementHandle}><i class="fa fa-plus" aria-hidden="true"></i></p>
				</div></>)}