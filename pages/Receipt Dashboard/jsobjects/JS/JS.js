export default {
	prepareTable:async ()=>{
		await SER_SEARCH_FOR_RECEIPT.run();
		Configs.PMS_RECEIPT_LM = SER_SEARCH_FOR_RECEIPT.data.filter(i=>i.TOTAL_RECORDS!==0).map(i=>(
			{'RECEIPT_NO':i.RECEIPT_NO||"",
			 'INVOICE_NO':i.INVOICE_NO||"",
			 'INVOICE_TYPE':i.INVOICE_TYPE||"",
			 'COMPANY_NAME':i.COMPANY_NAME||"",
			 'STATUS':i.STATUS||"",
			 'CREATE_DATE':i.CREATE_DATE? moment( i.CREATE_DATE).format(Configs.dateFormat):"",
			 'RECEIPT_ID':i.RECEIPT_ID,
			 'RECEIPT_AMOUNT':i.RECEIPT_AMOUNT,
			 'PAYMENT_TYPE':i.PAYMENT_TYPE
			}));
	},
	onEditClick:async()=>{
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;
		storeValue("INIT", PMS_RECEIPT_LM.selectedRow,true).then(() => {
			navigateTo('Receipt Detail', {}, 'SAME_WINDOW');
		});
	},
	onSearchClick:async()=>{
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;
		await resetWidget(PMS_RECEIPT_LM.widgetName,false);
		SP_SELECT_FOR_DASHBOARD.run();
		this.prepareTable();
	}
}