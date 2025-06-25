export default {
	onEditMeterClick:async ()=>{
		await storeValue(Configs.editMeter,Table_PMS_METER_REC_DETAIL_LM.selectedRow.METER_REC_ID);
		navigateTo("Meter Record Detail",{},"SAME_WINDOW");
	}
}