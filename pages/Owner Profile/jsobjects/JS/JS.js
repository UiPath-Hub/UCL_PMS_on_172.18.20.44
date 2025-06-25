export default {
	onSaveClick:async ()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			const alertWidget = await GlobalFunctions.manualValidate(Default_OwnerProfile,Form_OwnerInfo);
			if(alertWidget.length > 0){
				showAlert(`Some field is required or invalid.`)
			}else{
			showModal(Modal_SAVE.name);}
		}
	},
	onSaveConfirm:async()=>{
		await UPDATE_OWNER_PROFILE.run()
		if( UPDATE_OWNER_PROFILE.data && UPDATE_OWNER_PROFILE.data[0] && UPDATE_OWNER_PROFILE.data[0].affectedRows>0){
			await showAlert("Save success","success");
			await closeModal(Modal_SAVE.name);
			navigateTo(appsmith.URL.fullPath,{}, 'SAME_WINDOW');		
		}else{
			showAlert("Save failed","error");
		}


	},

}