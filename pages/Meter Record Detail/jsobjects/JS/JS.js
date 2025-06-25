export default {
	onDeleteButtonClick:()=>{
		if(Init.permissionsCheck(Configs.permissions.EDIT,false)){
			showModal(MODAL_DELETE.name);			
		}

	},
	onDeleteConfirmClick:async ()=>{
		if(Init.permissionsCheck(Configs.permissions.EDIT,false)){
			await UPDATE_DELETE_METER.run();
			await closeModal(MODAL_DELETE.name)
			navigateTo('Meter Record', {}, 'SAME_WINDOW');
		}
	},
	onBackBottonClick:async ()=>{
		await removeValue(Configs.METER_REC_ID);
		navigateTo('Meter Record', {}, 'SAME_WINDOW');
	}
}