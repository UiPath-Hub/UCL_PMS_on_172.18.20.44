export default {
	onNewItemClick:()=>{
		navigateTo('Manage Company Contact', {}, 'SAME_WINDOW');
	},
	onEditItemClick:()=>{
		if(PMS_COMPANY_CONTACT_LM.selectedRow["Contact Person Number"]==undefined)showAlert("Contact Person Number missing","error")
		navigateTo('Manage Company Contact', {[Configs.editContacePerson]:PMS_COMPANY_CONTACT_LM.selectedRow["Contact Person Number"]}, 'SAME_WINDOW');
	},
	onSearchClick:async()=>{
		await resetWidget(PMS_COMPANY_CONTACT_LM.widgetName);
		await SER_SEARCH_CONTACT_PERSON.run();
	},
	onSort:async()=>{
		console.log( PMS_COMPANY_CONTACT_LM.sortOrder)
	},
}