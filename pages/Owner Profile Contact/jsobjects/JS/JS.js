export default {
	onClickCancel:()=>{
		navigateTo('Owner Profile', {}, 'SAME_WINDOW');
	},
	DELETE:{
		requestToDelete:async ()=>{
			if(!GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
			showModal(MODAL_DELETE.name);	
		},
		confirmToDelete:async ()=>{
			await this.deleteContact();
		}
	},
	SAVE:{
		requestToSave: async ()=>{
			if(!GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
			let alertWidget = await GlobalFunctions.manualValidateV2(Default_OwnerProfileContact,Widget_OwnerProfileContact);
			if(alertWidget.length > 0){
				showAlert(`Some field is required or invalid.`)
			}else showModal(MODAL_SAVE.name);
		},
		confirmToSave: async ()=>{
			if(Configs.PageState.Current == Configs.PageState.NEW){
				await this.insertContact();
			}else if(Configs.PageState.Current == Configs.PageState.EDIT){
				await this.updateContact();
			}
		}
	},
	deleteContact:async ()=>{
			await _3_DELETE_CONTACT.run();
			if(_3_DELETE_CONTACT.data && _3_DELETE_CONTACT.data[0]){
					if(_3_DELETE_CONTACT.data[0].RESULT_CODE == 'DONE'){
						await closeModal(MODAL_DELETE.name);
						navigateTo('Owner Profile', {}, 'SAME_WINDOW');
					}else{
						showAlert("Delete failed: "+_3_DELETE_CONTACT.data[0].RESULT_MESSAGES);
					}
			}
	},
	updateContact:async ()=>{
		await _2_UPDATE_CONTACT.run();
		if(!_2_UPDATE_CONTACT.data || !_2_UPDATE_CONTACT.data[0]) return;
		let row = _2_UPDATE_CONTACT.data[0];
			if(row["RESULT_CODE"] === "DONE"){
				await showAlert( "Save success","success");
				await closeModal(MODAL_SAVE.name);
				navigateTo('Owner Profile', {}, 'SAME_WINDOW');
			}else{
				showAlert( "Save failed: "+row["RESULT_MESSAGES"],"error");
			}

	},
	insertContact:async ()=>{
		await _0_INSERT_CONTACT.run();
		if(!_0_INSERT_CONTACT.data || !_0_INSERT_CONTACT.data[0]) return;
		let row = _0_INSERT_CONTACT.data[0];
			if(row["RESULT_CODE"] === "DONE"){
				await showAlert( "Save success","success");
				await closeModal(MODAL_SAVE.name);
				showModal(MODAL_ADD_NEXT.name);
			}else{
				showAlert( "Save failed: "+row["RESULT_MESSAGES"],"error");
			}
	},
	onAddNextClick:async ()=>{
		await closeModal(MODAL_ADD_NEXT.name);
		navigateTo(appsmith.URL.fullPath,{}, 'SAME_WINDOW');
		
	},
	onNotAddNextClick:async()=>{
		await removeValue(Configs.editOwnerProfileContact);
		await closeModal(MODAL_ADD_NEXT.name);
		navigateTo('Owner Profile', {}, 'SAME_WINDOW');
	}
}