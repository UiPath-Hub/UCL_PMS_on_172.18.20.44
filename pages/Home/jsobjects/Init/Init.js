export default {
	PageLoad:async ()=>{
		await closeModal(Modal_Session_detail.name);
		await this.sessionCheck()

	},
	sessionCheck:async ()=>{
		if(appsmith.store["userSession"] && appsmith.store["userSession"].EMAIL== appsmith.user.email){
			await SP_HANDLE_TOKEN.run();
			if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
				let SESSION = appsmith.store["userSession"];//{TOKEN:"",PERMISSIONS:[]};
				if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
					Configs.forceLogin=true;
					showModal(Modal_Session_detail.name);
				}else{
					SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
					SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				}
				await storeValue(Configs.userSession,SESSION);
				//navigateTo('Login', {}, 'SAME_WINDOW');
			}else{
				if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
					showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
				}
				Configs.forceLogin=true;
				showModal(Modal_Session_detail.name);
			}
		}else navigateTo('Login', {}, 'SAME_WINDOW');
	},
	on_ModalSessionDetailClose:()=>{
		if(Configs.forceLogin)navigateTo('Login', {}, 'SAME_WINDOW');
	} 
}