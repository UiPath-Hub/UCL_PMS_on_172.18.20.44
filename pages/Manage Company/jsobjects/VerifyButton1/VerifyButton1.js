export default {
	//option
	InputBox: {...COMPANY_NAME_TH},
	passColor:"#15803d",
	invalidColor: "#ef4444",
	initColor: "#71717a",	
	//Verify Button
	Button:{...Bttn_verify1,
					"setLabel":async(text)=>{await Bttn_verify1.setLabel(text)},
					"setColor":async(color)=>{await Bttn_verify1.setColor(color);}
				 },
	//for ignore a verifing of default data.
	DefaultEntity:DefaultCompany,
	PropName:COMPANY_NAME_TH.widgetName,
	//this stored procedure need to return [{"COUNT":number}]
	countCheck:async()=>{
		await SELECT_DUPLICATE_NAME_TH.run();
		return SELECT_DUPLICATE_NAME_TH.data;

	},

	////////////////////////////////////////////////////////////////
	onClick: async()=>{
		if(this.InputBox.text == "" || !this.InputBox.isValid){
			await this.setInit();
			return;
		}
		let count = await this.countCheck();
		if(count&&count.length>0){
			if(count[0].COUNT>1 || (count[0].COUNT===1 && this.DefaultEntity[this.PropName].data != this.InputBox.text)){
				await this.setState("X",this.invalidColor);		
				console.log("X");
			}else{
				await this.setState("Pass",this.passColor);			
				console.log("Pass");
			}
		}
		
	},
	setInit:async ()=>{
		await this.setState("Verify",this.initColor);
	},
	setState:async(text,color)=>{
		if(this.Button.text != text){
			await Promise.all([ 
				this.Button.setLabel(text),this.Button.setColor(color)
			]);
		}
	}
}