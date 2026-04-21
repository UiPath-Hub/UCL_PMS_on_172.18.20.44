export default {
	dataDisplayStartTime:moment("2021-01-01",Configs.dateFormat),
	SINGLE_PAGE:"SINGLE_PAGE",
	userSession:"userSession",
	PageLoad:async ()=>{
		await storeValue(this.SINGLE_PAGE,{...SinglePageValueDefault});
		Configs.AllModals.forEach((modalName)=>closeModal(modalName));
		await this.sessionCheck();
		if(!this.permissionsCheck(Configs.permissions.VIEW,true))return;
		
		Object.keys(TableDisplay).forEach(async(tableName)=>{
			await JS.loadTable(tableName);
			console.log("data",TableDisplay.PMS_PROSPECTS_LM.data);
			resetWidget(tableName,false);
		})
		resetWidget(CONTAINER_SEARCH.widgetName,true);
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
	},
	on_ModalPermissionDeniedClose:()=>{
		//"appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName" use to ensure the Pageload function was already run.
		if(appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName&&appsmith.store[this.SINGLE_PAGE]?.forceLogin===true)navigateTo('Login', {}, 'SAME_WINDOW');
	},
	permissionsCheck:async(Permission,forceKick)=>{
		let PERMISSIONS = appsmith.store[this.userSession].PERMISSIONS;
		if(! PERMISSIONS.includes(Permission)){
			await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":forceKick,"errorAlert":"You do not have a permission to access this content. Please contact admin."});
			showModal(Modal_ErrorAlert.name);
			return false;
		}else return true;
	},
}