export default {
dataDisplayStartTime:moment("2021-01-01","YYYY-MM-DD"), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
		initDefault:async ()=>{
		const setAttribute =async (data)=>{
			if(data != undefined){
				Object.keys(Default_invoice).map((attribute)=>{
					if(data[attribute] != undefined){
						Default_invoice[attribute].data = data[attribute];
					}
				});			
				//await resetWidget("Form1",true);
			}
		}
		await SELECT_INVOICE.run();
		await SELECT_CONTACT_PERSON.run();
		await SELECT_INVOICE_ITEM.run();
		SELECT_INVOICE_ITEM.data.forEach((ele)=>Configs.invoice_items.push(ele));
		if(SELECT_INVOICE.data==undefined)return;
		let data = SELECT_INVOICE.data[0];
		await setAttribute(data);
		
	},
		fillValidation:async ()=>{
		const setAttribute =async (data,validationType)=>{
			if(data != undefined){
				Object.keys(Default_invoice).map((attribute)=>{
					if(data[attribute] != undefined){
						Default_invoice[attribute][validationType] = data[attribute];
					}
				});			
				//await resetWidget("Form1",true);
			}
		}
		await SELECT_FIELDS_VALIDATION.run();
		if(SELECT_FIELDS_VALIDATION.data==undefined)return;
		const regex = SELECT_FIELDS_VALIDATION.data.reduce((acc, ele) => {
			acc[ele.FIELD_NAME] = ele.REGEX; return acc;}, {});
		let required = SELECT_FIELDS_VALIDATION.data.reduce((acc, ele) => {
			acc[ele.FIELD_NAME] = ele.REQUIRED; return acc;}, {});
		await setAttribute(regex,"regex");
		await setAttribute(required,"required");
	},
  pageLoad	:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(await this.sessionCheck()){
			if(await this.permissionsCheck(Configs.permissions.VIEW,true)){
				await this.initDefault();
				await this.fillValidation();
				resetWidget("Form_main",true);
			}
		}else navigateTo('Login', {}, 'SAME_WINDOW');
	},
	sessionCheck:async ()=>{
		if(appsmith.store["userSession"] && appsmith.store["userSession"].EMAIL== appsmith.user.email){
			await SP_HANDLE_TOKEN.run();
			if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
				let SESSION = appsmith.store["userSession"];//{TOKEN:"",PERMISSIONS:[]};
				if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
					Configs.forceLogin = true;
					showModal(Modal_Session_detail.name);
				}else{
					SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
					SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				}
				await storeValue(Configs.userSession,SESSION);
				return true;
			}else{
				if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
					showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
				}
				Configs.forceLogin = true;
				showModal(Modal_Session_detail.name);
				return true;
			}
		}else return false;
	},
	on_ModalSessionDetailClose:()=>{
		if(Configs.forceLogin) navigateTo('Login', {}, 'SAME_WINDOW')
	},
	permissionsCheck:(Permission,forceKick)=>{
		let PERMISSIONS = appsmith.store["userSession"].PERMISSIONS;
		if(! PERMISSIONS.includes(Permission)){
			Configs.errorAlert = "You do not have a permission to access this content. Please contact admin."
			Configs.forceKick=forceKick;
			showModal(Modal_ErrorAlert.name);
			return false;
		}else return true;
	},
	on_ModalPermissionDeniedClose:()=>{
		if(Configs.forceKick) navigateTo('Home', {}, 'SAME_WINDOW');
	},
}