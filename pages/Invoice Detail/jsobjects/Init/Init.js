export default {
	dataDisplayStartTime:moment("2021-01-01","YYYY-MM-DD"), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
	initDefault:async ()=>{

		if(appsmith.URL.queryParams.selectedInvoice != undefined){
			await storeValue(Configs.selectedInvoice,{INVOICE_ID:appsmith.URL.queryParams.selectedInvoice},false);
		}else{
			Configs.forceKick = true;
			Configs.errorAlert = "Conflict parameter: Unknown Invoice ID.";
			showModal(Modal_ErrorAlert.name);
			return;
		}
		await SELECT_INVOICE.run();
		await SELECT_CONTACT_PERSON.run();
		await SELECT_INVOICE_ITEM.run();
		
		Configs.invoice_items = SELECT_INVOICE_ITEM.data;
		if(SELECT_INVOICE.data==undefined)return;
		let data = SELECT_INVOICE.data[0];


	},
	pageLoad	:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck()) return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await this.initDefault();
		Configs.BodyInit = "VIEW"
		resetWidget(Body.widgetName,true);

	},
}