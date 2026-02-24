export default {
	onEditMeterClick:async ()=>{
		if(await Init.sessionCheck()){
			if(await Init.permissionsCheck(Configs.permissions.VIEW,true)){
				await storeValue(Configs.editMeter,Table_PMS_METER_REC_DETAIL_LM.selectedRow.METER_REC_ID);
				navigateTo("Meter Record Detail",{},"SAME_WINDOW");
			}
		}else navigateTo('Login', {}, 'SAME_WINDOW');
	}
}