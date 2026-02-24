export default {
dataDisplayStartTime:moment("2021-01-01",Configs.dateFormat), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
  pageLoad	:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		closeModal(MODAL_APPROVE_CONFIRM.name)
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await SP_SER_SEARCH_FOR_INVOICE.run();
				if(SP_SER_SEARCH_FOR_INVOICE.data==undefined || SP_SER_SEARCH_FOR_INVOICE.data?.length === 0 || SP_SER_SEARCH_FOR_INVOICE.data[0]?.TOTAL_RECORDS === 0){
					await STATUS.setSelectedOption("");
					SP_SER_SEARCH_FOR_INVOICE.run();
				}
				//SP_SER_SEARCH_FOR_COMPANY.run();

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