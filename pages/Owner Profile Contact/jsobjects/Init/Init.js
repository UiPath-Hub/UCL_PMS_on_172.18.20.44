export default {
	PageLoad:async ()=>{
		Configs.startBody = "LOADING"
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck()) return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;
		
		let DefaultOwnerContact = {ENTITY:Default_OwnerProfileContact,DATA:{}}
		if(appsmith.URL.queryParams[Configs.editOwnerProfileContact]){
			//edit
			Configs.PageState.Current = Configs.PageState.EDIT;
			await _1_SELECT_CONTACT.run();
			if(_1_SELECT_CONTACT.data && _1_SELECT_CONTACT.data.length>0)
			DefaultOwnerContact.DATA = _1_SELECT_CONTACT.data[0]
		}else{
			//new
					
		}
		let InitializationEntity = [DefaultOwnerContact];
		await GlobalFunctions.initDefault(InitializationEntity);	
		await ADDRESSING.initAddress();
		//await resetWidget("Form1",true);
		Configs.startBody = "VIEW"


	}
}