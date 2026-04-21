export default {
	SINGLE_PAGE:"SINGLE_PAGE",
	userSession:"userSession",
	ID:"PROSPECTS_ID",
	PageLoad:async ()=>{
		await storeValue(this.SINGLE_PAGE,{...SinglePageValueDefault});
		Configs.AllModals.forEach((modalName)=>closeModal(modalName));
		await this.sessionCheck();
		
	},
	
	sessionCheck:async ()=>{
		if(appsmith.store[this.userSession] && appsmith.store[this.userSession].EMAIL== appsmith.user.email){
			await SP_HANDLE_TOKEN.run();
			if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
				let SESSION = appsmith.store[this.userSession];//{TOKEN:"",PERMISSIONS:[]};
				if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
					await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":true});
					showModal(Modal_Session_detail.name);
				}else{
					SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
					SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				}
				await storeValue(this.userSession,SESSION);
				//navigateTo('Login', {}, 'SAME_WINDOW');
			}else{
				if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
					showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
				}
				await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":true});
				showModal(Modal_Session_detail.name);
			}
		}else navigateTo('Login', {}, 'SAME_WINDOW');
	},
	on_ModalSessionDetailClose:()=>{
		//"appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName" use to ensure the Pageload function was already run.
		if(appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName&&appsmith.store[this.SINGLE_PAGE]?.forceLogin===true)navigateTo('Login', {}, 'SAME_WINDOW');
	}
}