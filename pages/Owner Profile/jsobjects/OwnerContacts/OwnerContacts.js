export default {
	onNewContactClick:async()=>{
		if(Form1.hasChanges){
			showAlert("Please, Save the owner profile before editing contacts.");
			return;
		}
		await storeValue(Configs.editOwnerProfileContact,{OWNER_ID:OWNER_ID.text});
		navigateTo('Owner Profile Contact', {}, 'SAME_WINDOW');
	},
	onEditContactClick:async()=>{
		if(Form1.hasChanges){
			showAlert("Please, Save the owner profile before editing contacts.");
			return;
		}
		await storeValue(Configs.editOwnerProfileContact,{OWNER_ID:OWNER_ID.text,OWNER_CONTACT_ID:Table_OwnerContactList.selectedRow.OWNER_CONTACT_ID});
		navigateTo('Owner Profile Contact', {[Configs.editOwnerProfileContact]:Table_OwnerContactList.selectedRow.OWNER_CONTACT_ID}, 'SAME_WINDOW');
	},
	test:async()=>{
		//await resetWidget("Form2",true);
		return Form1.hasChanges;
	}
}