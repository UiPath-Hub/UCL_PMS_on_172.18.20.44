export default {
	afterSyncErrorNotify:async ()=>{
		const pageName = Configs.syncedErrorEscape.pageName;
		const params = {...Configs.syncedErrorEscape.params};
		const SelectContact = {...Configs.syncedErrorEscape.SelectContact};
		Configs.syncedErrorEscape.SelectContact = {trigger: false};
		Configs.syncedErrorEscape.pageName = appsmith.currentPageName;
		Configs.syncedErrorEscape.params = {};
		if(SelectContact != undefined && SelectContact.trigger && SelectContact.ID){
			this.onClick_Bttn_SelectContact(SelectContact.ID);
		}else{
			if(pageName===appsmith.currentPageName){
				await navigateTo(appsmith.currentPageName,params);
				navigateTo(appsmith.URL.fullPath,{});
			}else{
				navigateTo(pageName,params);
			}
		}
		
	},
	TriggerSync:async(validateID,status)=>{
		try{
			await HealthCheck.run({COMPANY_ID:validateID});
			if(HealthCheck.data && HealthCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_checkReturnName]===appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_returnOKstatus && HealthCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_returnCompanyIDName] === validateID){
				await TriggerSync.run({COMPANY_ID:validateID,status:status});
				if(TriggerSync.data && TriggerSync.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.sync_checkReturnName] == appsmith.store.RPA_SYNC_STATUS.constantKeys.sync_returnOKstatus){
					return true;
				}
			}
			return false;
		}catch(err){
			return false;
		}
	},
	onClick_Bttn_BeginSelectContact:async ()=>{
		await _08_SEARCH_CONTACT_FOR_ADD.run();
		await showModal(Modal_Search_Contact.name);
	},
	onClick_Bttn_SelectContact:async(ContactID)=>{
		await closeModal(Modal_Search_Contact.name);
		await navigateTo(appsmith.currentPageName, {...appsmith.URL.queryParams,AS:Configs.pageState.AddContactTo,[Configs.editContacePerson]:ContactID}, 'SAME_WINDOW');
		navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW');
		//await Init.pageLoad();
	},
	onClick_Bttn_NewContact:async()=>{
		await closeModal(Modal_Search_Contact.name);
		let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
		//editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
		await navigateTo(appsmith.currentPageName, {...appsmith.URL.queryParams,AS:Configs.pageState.NewContactAndBack,[Configs.editContacePerson]:undefined,[Configs.editCompany]:editCompanyID }, 'SAME_WINDOW');
		navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW');
		//Init.pageLoad();
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
		}

		DefaultContact.COMPANY_CONTACT_ADD_NO.data=DefaultAddress.COMPANY_ADD_NO||""
		DefaultContact.COMPANY_CONTACT_FLOOR.data=DefaultAddress.COMPANY_FLOOR||""
		DefaultContact.COMPANY_CONTACT_MOO.data=DefaultAddress.COMPANY_MOO||""
		DefaultContact.COMPANY_CONTACT_SOI_EN.data=DefaultAddress.COMPANY_SOI_EN||""
		DefaultContact.COMPANY_CONTACT_SOI_TH.data=DefaultAddress.COMPANY_SOI_TH||""
		DefaultContact.COMPANY_CONTACT_ROAD_EN.data=DefaultAddress.COMPANY_ROAD_EN||""
		DefaultContact.COMPANY_CONTACT_ROAD_TH.data=DefaultAddress.COMPANY_ROAD_TH||""
		DefaultContact.COMPANY_CONTACT_POSTAL_CODE.data=DefaultAddress.COMPANY_POSTAL_CODE||""
		DefaultContact.COMPANY_CONTACT_SDISTRICT_TH.data = DefaultAddress.COMPANY_SUB_DISTRICT_TH||""
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
			const isBackToAssign = Configs.pageState.CurrentState==Configs.pageState.NewContactAndBack;
			if( _02_INSERT_CONTACT_LM.data !== undefined && _02_INSERT_CONTACT_LM.data.length > 0){
				if(_02_INSERT_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					const close= async()=>{
						await Promise.all([showAlert("Save success.","success"),closeModal(MODAL_SAVE.name)]) 
					}

					if(await this.TriggerSync(_02_INSERT_CONTACT_LM.data[0].INSERTED_COMPANY_CONTACT_ID,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Add"].status)){
						await close();
						if(isBackToAssign)
						{
							if(_02_INSERT_CONTACT_LM.data[0]["RESULT_MESSAGES"])
								this.onClick_Bttn_SelectContact(_02_INSERT_CONTACT_LM.data[0]["RESULT_MESSAGES"]);						
						}
						else
							showModal(MODAL_ADD_NEXT.name);
					}else{
						if(!_02_INSERT_CONTACT_LM.data[0].INSERTED_COMPANY_CONTACT_ID) return showAlert("Unknown Contact ID","error");
						await close();
						if(isBackToAssign){
							Configs.syncedErrorEscape.SelectContact = {trigger: true, ID: _02_INSERT_CONTACT_LM.data[0].INSERTED_COMPANY_CONTACT_ID};
						}else{
							if(appsmith.store.PAGES_QUEUE[0] == Configs.CompanyPageName){
								Configs.syncedErrorEscape.pageName=appsmith.store.PAGES_QUEUE[0];
							}else{
								Configs.syncedErrorEscape.pageName=appsmith.currentPageName;
							}
							Configs.syncedErrorEscape.params = {[Configs.editContacePerson]:_02_INSERT_CONTACT_LM.data[0].INSERTED_COMPANY_CONTACT_ID};
						}
						showModal(MODAL_ALTER_SYNC.name);
					}
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
					const close= async()=>{
						await Promise.all([showAlert("Save success.","success"),closeModal(MODAL_SAVE.name)]) 
					}
					if(await this.TriggerSync(COMPANY_CONTACT_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Edit"].status)){
						await close();
						//go back to dashboard						
						navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.ContactDashboardPageName, {...appsmith.URL.queryParams}, 'SAME_WINDOW');
					}else{
						await close();
						Configs.syncedErrorEscape.pageName= appsmith.URL.fullPath;
						showModal(MODAL_ALTER_SYNC.name);
					}
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
					const close= async()=>{
						await Promise.all([showAlert("Save success.","success"),closeModal(MODAL_SAVE.name)]) 
					}
					if(await this.TriggerSync(COMPANY_CONTACT_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Edit"].status)){
						await close();
						//Go back to Manage Company
						navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.CompanyPageName,{...appsmith.URL.queryParams} , 'SAME_WINDOW');
					}else{
						await close();
						Configs.syncedErrorEscape.pageName= appsmith.URL.fullPath;
						showModal(MODAL_ALTER_SYNC.name);
					}
				}
				else{
					await showAlert("Save failed."+_04_UPDATE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
					return;
				}
			}


		}else if(Configs.pageState.CurrentState==Configs.pageState.EditContactOf){
			//Update Assigned role of Company/Third Party
			//Update Contact depend on editable field.
			await _04_UPDATE_CONTACT_LM.run({UPDATE_ASSIGNED:1,UPDATE_NULL:0})
			if( _04_UPDATE_CONTACT_LM.data !== undefined && _04_UPDATE_CONTACT_LM.data.length > 0){
				if(_04_UPDATE_CONTACT_LM.data[0]["RESULT_CODE"] === 'DONE'){
					const close= async()=>{
						await Promise.all([showAlert("Save success.","success"),closeModal(MODAL_SAVE.name)]) 
					}
					if(await this.TriggerSync(COMPANY_CONTACT_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Edit"].status)){
						await close();
						//Go back to Manage Company
						navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.CompanyPageName,{...appsmith.URL.queryParams} , 'SAME_WINDOW');
					}else{
						await close();
						Configs.syncedErrorEscape.pageName= appsmith.URL.fullPath;
						showModal(MODAL_ALTER_SYNC.name);
					}
				}
				else{
					await showAlert("Save failed."+_04_UPDATE_CONTACT_LM.data[0]["RESULT_MESSAGES"],"error");
					return;
				}
			}
		}else showAlert("Missing save method. Please,Contact admin.");
	},
	onBttnAddMoreClick:async ()=>{
		await closeModal(MODAL_ADD_NEXT.name)
		await navigateTo(appsmith.currentPageName, {AS:Configs.pageState.ManageContact}, 'SAME_WINDOW');
		navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW');
		//Init.pageLoad();

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
					const close= async()=>{
						await closeModal(MODAL_DELETE.name);
					}
					
					if(await this.TriggerSync(COMPANY_CONTACT_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Delete"].status)){
						await close();
						//go back to dashboard
						navigateTo(appsmith.store.PAGES_QUEUE[0]|| Configs.ContactDashboardPageName, {...appsmith.URL.queryParams}, 'SAME_WINDOW');
					}else{
						await close();
						Configs.syncedErrorEscape.pageName= appsmith.store.PAGES_QUEUE[0]||Configs.ContactDashboardPageName;
						Configs.syncedErrorEscape.params =  {...appsmith.URL.queryParams};
						showModal(MODAL_ALTER_SYNC.name);
					}

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
					navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.CompanyPageName,{...appsmith.URL.queryParams} , 'SAME_WINDOW');

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
		//let editCompanyID = appsmith.URL.queryParams[Configs.editCompany];
		//editCompanyID = editCompanyID?editCompanyID!="TEMP"?editCompanyID:undefined:undefined;
		if(Configs.pageState.CurrentState==Configs.pageState.AddContactTo || Configs.pageState.CurrentState==Configs.pageState.EditContactOf)
		{
			/*[Configs.editCompany]:editCompanyID,NEWBRANCH:appsmith.store.NEWBRANCH*/
			navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.CompanyPageName, {...appsmith.URL.queryParams}   , 'SAME_WINDOW');

		}else if(Configs.pageState.CurrentState==Configs.pageState.NewContactAndBack)
		{
			await navigateTo(appsmith.currentPageName, {...appsmith.URL.queryParams,AS:Configs.pageState.AddContactTo}, 'SAME_WINDOW');
			navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW');
			//Init.pageLoad();

		}
		else navigateTo(appsmith.store.PAGES_QUEUE[0]||Configs.ContactDashboardPageName, {...appsmith.URL.queryParams}, 'SAME_WINDOW');

	},
	test:()=>{return appsmith.store.NEWBRANCH}
}