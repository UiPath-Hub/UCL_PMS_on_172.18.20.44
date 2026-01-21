export default {
	tst:()=>{
		STATUS.setSelectedOption("");
	},
	onEditItemClick:async (selectedRow)=>{
		await storeValue("INIT",selectedRow);
		navigateTo("Invoice Detail",{},"SAME_WINDOW");

	},
	onBttn_ChangeStatus_ApproveDisable:(invoice_list)=>{
		invoice_list = Table_PMS_INVOICE_LMEXECUTIVE.selectedRows;
		let disableStatus = ["Draft Invoice","Approved","Waiting for Payment","Over Due","Canceled","Payment Completed","Rejected"];
		invoice_list.filter((i)=>disableStatus.includes(i.STATUS));
		if( invoice_list.length > 0){
			showAlert(`Unexpected the invoice status ${invoice_list[0].STATUS} with Invoice Number ${invoice_list[0].INVOICE_NO}`)
			return true
		}else{
			return false
		}
	},
	onBttn_APPROVE_INVOICE:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.SHOW_INVOICE_EXECUTE,true)) return;
		const unexpectedInvoiceStatus = Table_PMS_INVOICE_LMEXECUTIVE.selectedRows.find(i=>Configs.bttnAPPROVE_disableStatus.includes(i.STATUS));
		if(unexpectedInvoiceStatus){
			showAlert(`Could not approve the invoice whose status is "${unexpectedInvoiceStatus.STATUS}".`,"warning");
			return;
		}
		if(confirm){

			await _1_ApproveInvoice.run({INVOICE_IDs:Table_PMS_INVOICE_LMEXECUTIVE.selectedRows.filter(i=>i.INVOICE_ID).map(i=>i.INVOICE_ID)})
			if(_1_ApproveInvoice.responseMeta.isExecutionSuccess){
				await closeModal(MODAL_APPROVE_CONFIRM.name)
				SP_SER_SEARCH_FOR_INVOICE.run();
				SP_SELECT_FOR_DASHBOARD.run();
				resetWidget(Table_PMS_INVOICE_LMEXECUTIVE.widgetName);
			}else{
				showAlert(_1_ApproveInvoice.data, 'error');
			}


		}else{
			await showModal(MODAL_APPROVE_CONFIRM.name);
		}
	},
	onBttn_ChangeStatus_ApproveDisable:()=>{
		return Table_PMS_INVOICE_LMEXECUTIVE.selectedRows.find(i=>Configs.bttnAPPROVE_disableStatus.includes(i.STATUS))
	},
}