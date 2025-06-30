export default {
	onClick_Bttn_BeginSelectContact:async ()=>{
		await _08_SEARCH_CONTACT_FOR_ADD.run();
		await showModal(Modal_Search_Contact.name);
	},
	onClick_Bttn_SelectContact:async(ContactID)=>{
		await closeModal(Modal_Search_Contact.name);
		await navigateTo("Manage Company Contact", {...appsmith.URL.queryParams,AS:Configs.pageState.AddContactTo,[Configs.editContacePerson]:ContactID}, 'SAME_WINDOW');
		await Init.pageLoad();
	},
	onClick_Bttn_NewContact:async()=>{
		await closeModal(Modal_Search_Contact.name);
		let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
		//editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
		await navigateTo("Manage Company Contact", {...appsmith.URL.queryParams,AS:Configs.pageState.NewContactAndBack,[Configs.editCompany]:editCompanyID }, 'SAME_WINDOW');
		Init.pageLoad();
	},
	onClick_Bttn_SearchContactForAdd:async ()=>{
		await resetWidget(Table_SearchResults_Contact.widgetName);
		await _08_SEARCH_CONTACT_FOR_ADD.run()
	},
	onClick_Save:async ()=>{
		if(await GlobalFunctions .permissionsCheck(Configs.permissions.EDIT,false)){
			let alertWidget = await GlobalFunctions.manualValidateV2(DefaultContact,Contact_Widget);

			if(alertWidget.length > 0){
				showAlert(`Some field is required or invalid.`)
			}else showModal(MODAL_SAVE.name);
		}
	},
	onDuplicateAddress:async()=>{
		let DefaultAddress={};
		if(appsmith.store[Configs.newCompanyTempFlag]){
			DefaultAddress = appsmith.store[Configs.newCompanyTempFlag]
		}else if(appsmith.store[Configs.DEFAULT_COMPANY]){
			DefaultAddress = appsmith.store[Configs.DEFAULT_COMPANY]
		}
		/*await Promise.all([
			COMPANY_CONTACT_ADD_NO.setValue(DefaultAddress.COMPANY_ADD_NO||""),
			COMPANY_CONTACT_FLOOR.setValue(DefaultAddress.COMPANY_FLOOR||""),
			COMPANY_CONTACT_MOO.setValue(DefaultAddress.COMPANY_MOO||""),
			COMPANY_CONTACT_SOI_EN.setValue(DefaultAddress.COMPANY_SOI_EN||""),
			COMPANY_CONTACT_SOI_TH.setValue(DefaultAddress.COMPANY_SOI_TH||""),
			COMPANY_CONTACT_ROAD_EN.setValue(DefaultAddress.COMPANY_ROAD_EN||""),
			COMPANY_CONTACT_ROAD_TH.setValue(DefaultAddress.COMPANY_ROAD_TH||""),
			POSTAL_CODE.setValue(DefaultAddress.POSTAL_CODE||""),
			PROVINCE_TH.setSelectedOption(DefaultAddress.PROVINCE_TH||""),
			DISTRICT_TH.setSelectedOption(DefaultAddress.DISTRICT_TH||""),
			SUB_DISTRICT_TH.setSelectedOption(DefaultAddress.SUB_DISTRICT_TH||"") 	
		])*/
		DefaultContact.COMPANY_CONTACT_ADD_NO.data=DefaultAddress.COMPANY_ADD_NO||""
		DefaultContact.COMPANY_CONTACT_FLOOR.data=DefaultAddress.COMPANY_FLOOR||""
		DefaultContact.COMPANY_CONTACT_MOO.data=DefaultAddress.COMPANY_MOO||""
		DefaultContact.COMPANY_CONTACT_SOI_EN.data=DefaultAddress.COMPANY_SOI_EN||""
		DefaultContact.COMPANY_CONTACT_SOI_TH.data=DefaultAddress.COMPANY_SOI_TH||""
		DefaultContact.COMPANY_CONTACT_ROAD_EN.data=DefaultAddress.COMPANY_ROAD_EN||""
		DefaultContact.COMPANY_CONTACT_ROAD_TH.data=DefaultAddress.COMPANY_ROAD_TH||""
		DefaultContact.COMPANY_CONTACT_POSTAL_CODE.data=DefaultAddress.COMPANY_POSTAL_CODE||""
		DefaultContact.COMPANY_CONTACT_SDISTRICT_TH.data =DefaultAddress.COMPANY_SUB_DISTRICT_TH||""
		DefaultContact.COMPANY_CONTACT_DISTRICT_TH.data=DefaultAddress.COMPANY_DISTRICT_TH||""
		DefaultContact.COMPANY_CONTACT_PROVINCE_TH.data=DefaultAddress.COMPANY_PROVINCE_TH||""
		await ADDRESSING.initAddress();
	},
	saveBttn_click:async ()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		let ContactID = _.trim(COMPANY_CONTACT_ID.text);
		if((Configs.pageState.CurrentState == Configs.pageState.ManageContact || Configs.pageState.CurrentState==Configs.pageState.NewContactAndBack) && !ContactID){
			//insert Contact
			await _02_INSERT_CONTACT_LM.run()
			if( _02_INSERT_CONTACT_LM.data !== undefined && _02_INSERT_CONTACT_LM.data.length > 0){
				if(_02_INSERT_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					await showAlert("Save success.","success");
					await closeModal(MODAL_SAVE.name)
					if(Configs.pageState.CurrentState==Configs.pageState.NewContactAndBack)
					{
						if(_02_INSERT_CONTACT_LM.data[0]["RESULT_MESSAGES"])
						this.onClick_Bttn_SelectContact(_02_INSERT_CONTACT_LM.data[0]["RESULT_MESSAGES"]);						
					}
					else
						showModal(MODAL_ADD_NEXT.name);
				}
				else{
					await showAlert("Save failed."+_02_INSERT_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
				}
			}
		}else if(Configs.pageState.CurrentState == Configs.pageState.ManageContact && ContactID){
			//edit Contact
			await _04_UPDATE_CONTACT_LM.run()
			if( _04_UPDATE_CONTACT_LM.data !== undefined && _04_UPDATE_CONTACT_LM.data.length > 0){
				if(_04_UPDATE_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					await showAlert("Save success.","success");
					await closeModal(MODAL_SAVE.name)
					//go back to dashboard
					navigateTo("Contact Person Dashboard", {}, 'SAME_WINDOW');

				}
				else{
					await showAlert("Save failed."+_04_UPDATE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
				}
			}
		}else if(Configs.pageState.CurrentState==Configs.pageState.AddContactTo){
			//Assign Contact to Company/Third Party
			//Update Contact depend on editable field.
			await _04_UPDATE_CONTACT_LM.run({ASSIGN_TO_COMPANY:1,UPDATE_NULL:0})
			if( _04_UPDATE_CONTACT_LM.data !== undefined && _04_UPDATE_CONTACT_LM.data.length > 0){
				if(_04_UPDATE_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					await showAlert("Save success.","success");
					await closeModal(MODAL_SAVE.name)
				}
				else{
					await showAlert("Save failed."+_04_UPDATE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
					return;
				}
			}
			//Go back to Manage Company
			let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
					editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
			navigateTo('Manage Company', {[Configs.editCompany]:editCompanyID,NEWBRANCH:appsmith.store.NEWBRANCH}, 'SAME_WINDOW');

		}else if(Configs.pageState.CurrentState==Configs.pageState.EditContactOf){
			//Update Assigned role of Company/Third Party
			//Update Contact depend on editable field.
			await _04_UPDATE_CONTACT_LM.run({UPDATE_ASSIGNED:1,UPDATE_NULL:0})
			if( _04_UPDATE_CONTACT_LM.data !== undefined && _04_UPDATE_CONTACT_LM.data.length > 0){
				if(_04_UPDATE_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					await showAlert("Save success.","success");
					await closeModal(MODAL_SAVE.name)
				}
				else{
					await showAlert("Save failed."+_04_UPDATE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
					return;
				}
			}
			//Go back to Manage Company
			let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
					editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
			navigateTo('Manage Company', {[Configs.editCompany]:editCompanyID,NEWBRANCH:appsmith.store.NEWBRANCH}, 'SAME_WINDOW');

		}else showAlert("Missing save method. Please,Contact admin.");
	},
	onBttnAddMoreClick:()=>{
		closeModal(MODAL_ADD_NEXT.name).then(() => {
			navigateTo("Manage Company Contact", {AS:Configs.pageState.ManageContact}, 'SAME_WINDOW');
			Init.pageLoad();
		});
	}
	,
	onDeleteCompanyContact:async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		let ContactID = _.trim(COMPANY_CONTACT_ID.text);
		if(Configs.pageState.CurrentState == Configs.pageState.ManageContact && ContactID){
			//delete Contact
			await _06_DELETE_CONTACT_LM.run()
			if( _06_DELETE_CONTACT_LM.data !== undefined && _06_DELETE_CONTACT_LM.data.length > 0){
				if(_06_DELETE_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					//await showAlert("Delete success.","success");
					await closeModal(MODAL_DELETE.name);
					navigateTo('Contact Person Dashboard', {}, 'SAME_WINDOW');
				}
				else{
					showAlert("Delete failed."+_06_DELETE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
				}
			}
		}else if(Configs.pageState.CurrentState == Configs.pageState.EditContactOf && ContactID){
			//delete Assigned contact of Company/Third Party
			await _07_UNASSIGN_CONTACT.run()
			if( _07_UNASSIGN_CONTACT.data !== undefined && _07_UNASSIGN_CONTACT.data.length > 0){
				if(_07_UNASSIGN_CONTACT.data[0]["RESULT_CODE"] === 'DONE'){
					//await showAlert("Remove success.","success");
					await closeModal(MODAL_DELETE.name);
					//Go back to Manage Company
					let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
							editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
					navigateTo('Manage Company', {[Configs.editCompany]:editCompanyID,NEWBRANCH:appsmith.store.NEWBRANCH}, 'SAME_WINDOW');					
				}
				else{
					showAlert("Delete failed."+_07_UNASSIGN_CONTACT.data[0]["RESULT_MESSAGES"],"error");
					return;
				}
			}
		}else showAlert("Missing delete method. Please,Contact admin.");

	},
	onDeleteButtonClick:async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		showModal(MODAL_DELETE.name);
	}
	,
	onBttnGoBackClick:async()=>{
		await closeModal(MODAL_ADD_NEXT.name);
		this.onCancelClick();

	},
	isArrayUndefinedOrEmpty:(array)=>{
		if(array != undefined && array.length !== 0){
			return false;
		}else{
			return true;
		}
	},
	onCancelClick:async()=>{
		let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
		editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
		if(Configs.pageState.CurrentState==Configs.pageState.AddContactTo || Configs.pageState.CurrentState==Configs.pageState.EditContactOf)
		{
			navigateTo('Manage Company', {[Configs.editCompany]:editCompanyID,NEWBRANCH:appsmith.store.NEWBRANCH}  , 'SAME_WINDOW');

		}else if(Configs.pageState.CurrentState==Configs.pageState.NewContactAndBack)
		{
			await navigateTo("Manage Company Contact", {...appsmith.URL.queryParams,AS:Configs.pageState.AddContactTo}, 'SAME_WINDOW');
			Init.pageLoad();

		}
		else navigateTo('Contact Person Dashboard', {}, 'SAME_WINDOW');

	},
	test:()=>{return appsmith.store[Configs.newCompanyTempFlag]}
}