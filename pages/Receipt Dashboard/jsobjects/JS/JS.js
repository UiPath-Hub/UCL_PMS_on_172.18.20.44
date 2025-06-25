export default {
	onEditItemClick:async ()=>{
		await storeValue(Configs.editMeter,Table_PMS_INVOICE_LM.selectedRow.METER_REC_ID);
		navigateTo("Meter Record Detail",{},"SAME_WINDOW");
	}
}