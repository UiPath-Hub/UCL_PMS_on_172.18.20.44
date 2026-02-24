export default {
	onClick_BUTTON_SEARCH:async ()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await resetWidget(PMS_COMPANY_LM.widgetName);
		SP_SER_SEARCH_FOR_COMPANY.run()
	},
	onBUTTON_NEWClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await removeValue(Configs.newCompanyTempFlag);
		await storeValue(Configs.IS_THIRD_PARTY,Configs.companyPageState.COMPANY,true);
		navigateTo('Manage Company', {}, 'SAME_WINDOW');
	},
	onBUTTON_EDITClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
  	await removeValue(Configs.newCompanyTempFlag);
		if(!PMS_COMPANY_LM.selectedRow["COMPANY_ID"]) return showAlert("Unknown Company ID","error");
		await storeValue(Configs.IS_THIRD_PARTY,Configs.companyPageState.COMPANY,true);
		navigateTo('Manage Company', {[Configs.editFlag]:PMS_COMPANY_LM.selectedRow["COMPANY_ID"]}, 'SAME_WINDOW');
	}
}