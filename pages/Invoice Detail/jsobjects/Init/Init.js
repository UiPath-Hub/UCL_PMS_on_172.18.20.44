export default {
	dataDisplayStartTime:moment("2021-01-01","YYYY-MM-DD"), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
	initDefault:async ()=>{

		if(appsmith.store.INIT===undefined && !appsmith.URL.queryParams.InvoiceNumber){
			Configs.forceKick = true;
			Configs.errorAlert = "Conflict parameter: Unknown selected invoice.";
			showModal(Modal_ErrorAlert.name);
			return;
		}else{
			if(appsmith.URL.queryParams.InvoiceNumber){
				await storeValue("INIT",{INVOICE_NO:appsmith.URL.queryParams.InvoiceNumber});
			}
		}
		await SELECT_INVOICE.run()
		await SELECT_INVOICE_ITEM.run(),
		Configs.invoice_items = SELECT_INVOICE_ITEM.data;
		console.log(SELECT_INVOICE.data);
		let InitializationEntityList = [{ENTITY:PMS_INVOICE_LM,DATA: SELECT_INVOICE.data[0]},
																			//{ENTITY:PMS_COMPANY_LM,DATA: SELECT_COMPANY.data},
																			//{ENTITY:PMS_COMPANY_CONTACT_LM,DATA: SELECT_COMPANY_CONTACT.data},
																			//{ENTITY:PMS_COMPANY_BILLING,DATA: SELECT_BILLING.data}
																		];
		await GlobalFunctions.initDefault(InitializationEntityList);		
		
		//manipulate field data		
		/*if(SELECT_COMPANY.data && SELECT_COMPANY.data[0] && SELECT_COMPANY.data[0].OVERWRITE_BILLING_ADDRESS){
			//mapping billing to company
			PMS_COMPANY_LM.COMPANY_ADD_NO.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_ADD_NO.data
			PMS_COMPANY_LM.COMPANY_FLOOR.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_FLOOR.data
			PMS_COMPANY_LM.COMPANY_MOO.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_MOO.data
			PMS_COMPANY_LM.COMPANY_SOI_TH.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_SOI_TH.data
			PMS_COMPANY_LM.COMPANY_ROAD_TH.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_ROAD_TH.data
			PMS_COMPANY_LM.COMPANY_SUB_DISTRICT_TH.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_SUB_DISTRICT_TH.data
			PMS_COMPANY_LM.COMPANY_DISTRICT_TH.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_DISTRICT_TH.data
			PMS_COMPANY_LM.COMPANY_PROVINCE_TH.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_PROVINCE_TH.data
			PMS_COMPANY_LM.COMPANY_POSTAL_CODE.data=			PMS_COMPANY_BILLING.BILLING_COMPANY_POSTAL_CODE.data
		}

		PMS_COMPANY_CONTACT_LM.COMPANY_CONTACT_FIRST_NAME_TH.data = PMS_COMPANY_CONTACT_LM.COMPANY_CONTACT_FIRST_NAME_TH.data + " " + PMS_COMPANY_CONTACT_LM.COMPANY_CONTACT_SUR_NAME_TH.data
		*/
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