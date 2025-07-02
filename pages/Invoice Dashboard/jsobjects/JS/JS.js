export default {
	onEditItemClick:async ()=>{
		//await storeValue(Configs.selectedInvoice,Table_PMS_INVOICE_LM.selectedRow);
		navigateTo("Invoice Detail",{[Configs.selectedInvoice]:Table_PMS_INVOICE_LM.selectedRow.INVOICE_ID},"SAME_WINDOW");
	}
}