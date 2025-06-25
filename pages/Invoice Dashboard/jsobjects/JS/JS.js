export default {
	onEditItemClick:async ()=>{
		await storeValue(Configs.selectedInvoice,Table_PMS_INVOICE_LM.selectedRow);
		navigateTo("Invoice Detail",{},"SAME_WINDOW");
	}
}