export default {
	setDefaultIconOfSyncStatus:async ()=>{
		await SP_DD_RPA_SYNC_STATUS.run();	
		if(SP_DD_RPA_SYNC_STATUS.data && SP_DD_RPA_SYNC_STATUS.data.length > 0){
			SP_DD_RPA_SYNC_STATUS.data.forEach(e=>{
				if((Configs.ERPSyncConfig.syncStatusIconMap[e.SYSTEM_VALUE]!==undefined || Configs.ERPSyncConfig.syncStatusIconMap[e.SYSTEM_VALUE]!== null ) &&
					Configs.ERPSyncConfig.syncStatusIconMap[e.SYSTEM_VALUE] != undefined){
					Configs.ERPSyncConfig.syncStatusIconMap[e.SYSTEM_VALUE].status = e.FIXED_VALUE;
				}
			})

		}
		await storeValue(Configs.ERPSyncConfig.masterName,Configs.ERPSyncConfig)
	},
	on_confirmClick:async ()=>{
		await SP_HANDLE_TOKEN.run();
		if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
			let SESSION = {TOKEN:"",PERMISSIONS:[],EMAIL:appsmith.user.email};
			if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
				showAlert("Create session error.");
			}else{
				SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
				SESSION.START_PAGE = SP_HANDLE_TOKEN.data[0].START_PAGE;
				SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				await storeValue(Configs.userSession,SESSION);
				await this.setDefaultIconOfSyncStatus();
				navigateTo(SESSION.START_PAGE, {}, 'SAME_WINDOW');
			}

		}else{
			if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
				showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
			}else{
				showAlert("No any permissions assigned. Please, contact admin.","error");
			}
		}
	},

}