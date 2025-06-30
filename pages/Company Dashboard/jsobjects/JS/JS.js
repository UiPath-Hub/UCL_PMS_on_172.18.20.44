export default {
	onClick_BUTTON_SEARCH:async ()=>{
		await resetWidget(PMS_COMPANY_LM.widgetName);
		SP_SER_SEARCH_FOR_COMPANY.run()
	},
	onBUTTON_NEWClick:async()=>{
		//await removeValue(Configs.editFlag);
		await removeValue(Configs.newCompanyTempFlag);
		await storeValue(Configs.IS_THIRD_PARTY,Configs.companyPageState.COMPANY,true);
		navigateTo('Manage Company', {NEWBRANCH:moment().format("DDMMYYYYmmss").toString()}, 'SAME_WINDOW');
	},
	onBUTTON_EDITClick:async()=>{
		//await storeValue(Configs.editFlag, PMS_COMPANY_LM.selectedRow)
  	await removeValue(Configs.newCompanyTempFlag);
		if(!PMS_COMPANY_LM.selectedRow["COMPANY_ID"]) return showAlert("Unknown Company ID","error");
		await storeValue(Configs.IS_THIRD_PARTY,Configs.companyPageState.COMPANY,true);
		navigateTo('Manage Company', {[Configs.editFlag]:PMS_COMPANY_LM.selectedRow["COMPANY_ID"]}, 'SAME_WINDOW');
	}
}