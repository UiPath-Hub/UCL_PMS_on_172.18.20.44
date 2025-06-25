export default {
	pageLoad:async ()=>{
		Configs.startBody = "LOADING";
		const viewTimeout = setTimeout(()=>{Configs.startBody="VIEW"},5000);
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;
		
		await SELECT_OWNER_PROFILE.run();
		if(SELECT_OWNER_PROFILE.data!=undefined&&SELECT_OWNER_PROFILE.data.length>0){
			let InitializationEntityList = [{ENTITY:Default_OwnerProfile,DATA: SELECT_OWNER_PROFILE.data[0]}];
			await GlobalFunctions.initDefault(InitializationEntityList);
			await ADDRESSING.initAddress();
			SELECT_OWNER_CONTACTS.run();
			Configs.startBody="VIEW"
			clearTimeout(viewTimeout);
		}else{
			Configs.errorAlert = "Could not found Owner Profile. Please,select any tenant."
			Configs.forceKick=true;
			showModal(Modal_ErrorAlert.name);
		}

	},
	test:()=>{
		resetWidget("Form_OwnerInfo");
		return Form_OwnerInfo.data
	}
}