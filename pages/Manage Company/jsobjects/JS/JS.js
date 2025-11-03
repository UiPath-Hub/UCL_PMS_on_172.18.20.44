export default {
	sortPriorityContact:()=>{
		Configs.showCompanyContact = Configs.showCompanyContact.sort((a, b) => (b["Contact ID"]===Configs.PRIORITY_CONTACT_ID?1:0) - (a["Contact ID"]===Configs.PRIORITY_CONTACT_ID?1:0));
	},
	setPriorityContact:async (triggeredRow)=>{
		Configs.PRIORITY_CONTACT_ID = triggeredRow["Contact ID"];
		this.sortPriorityContact();
	},
	onChangedLanguage:async()=>{
		DefaultCompany[ADDRESSING.PROVINCE_PROP_NAME].data = ADDRESSING.PROVINCE_WIDGET.selectedOptionValue
	},
	onClick_ButtonCancel:async ()=>{
		if(Configs.IS_THIRD_PARTY)
			navigateTo('Third Party Dashboard', {}, 'SAME_WINDOW');
		else navigateTo('Company Dashboard', {}, 'SAME_WINDOW');
	},
	onClick_BUTTON_ADD_YES:async ()=>{
		await closeModal(MODAL_ADD_NEXT.name);
		await navigateTo(appsmith.currentPageName, {}, 'SAME_WINDOW');
		navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW');
	},
	onClick_BUTTON_ADD_NO:async ()=>{
		await closeModal(MODAL_ADD_NEXT.name)
		if(!Configs.IS_THIRD_PARTY)
			navigateTo('Company Dashboard', {}, 'SAME_WINDOW');
		else navigateTo('Third Party Dashboard', {}, 'SAME_WINDOW');
		//removeValue(Configs.editCompanyFlag);
		//removeValue(Configs.fromCompany);

	},
	onClick_Save:async ()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(!(Configs.showCompanyContact.filter(i=>i.TOTAL_RECORDS!==0).find(i=>i["Contact ID"]=== Configs.PRIORITY_CONTACT_ID)) && Configs.showCompanyContact.filter(i=>i.TOTAL_RECORDS!==0).length>0){
				showModal(Modal_NeedPriorityContact.name);
				return;
			}
			let alertWidget = await GlobalFunctions.manualValidateV2(DefaultCompany,Company_Widgets);
			let alertBilling = [];

			if(OVERWRITE_BILLING_ADDRESS.selectedOptionValue=="true"){
				//let datastr = "data"
				alertBilling = await GlobalFunctions.manualValidateV2(Default_COMPANY_BILLING,CompanyBilling_Widgets);
				const unique_Array = Array.from(new Set(alertBilling.map(i=>(i.label ||  _.toLower( i.widgetName).replaceAll("_"," ")))));
				if(alertBilling.length > 0){
					let text = `Billing information is required or invalid. :: ${unique_Array.join(',')}`;
					if(Configs.IS_THIRD_PARTY){
						text = text.replaceAll('company','third party');
					}
					showAlert(text)
					//alertWidget = [...alertWidget,...alertBilling]
				}
			}
			if(alertWidget.length > 0){
				const unique_Array = Array.from(new Set(alertWidget.map(i=>(i.label ||  _.toLower( i.widgetName).replaceAll("_"," ")))));
				let text = `Company information is required or invalid. :: ${ unique_Array.join(',')}`
				if(Configs.IS_THIRD_PARTY){
					text = text.replaceAll('company','third party');
				}
				showAlert(text);
			}
			if(alertWidget.length == 0 && alertBilling.length == 0)
				showModal(MODAL_SAVE.name);
		}
	},

	onTAX_IDBlur:()=>{
		if(TAX_ID.text == "" || TAX_ID.text == undefined)return;
		let regex = /^\d+$/;
		TAX_ID.setValue(TAX_ID.text.toString().split('').filter((ele)=>regex.test(ele)).join(''))
	},
	onBILLING_TAX_IDBlur:()=>{
		if(BILLING_TAX_ID.text == "" || BILLING_TAX_ID.text == undefined)return;
		let regex = /^\d+$/;
		BILLING_TAX_ID.setValue(BILLING_TAX_ID.text.toString().split('').filter((ele)=>regex.test(ele)).join(''))
	},
	TriggerSync:async(validateID,status)=>{
		await HealthCheck.run({COMPANY_ID:validateID});
		if(HealthCheck.data && HealthCheck.data.status==="ok" && HealthCheck.data.COMPANY_ID === validateID){
			await TriggerSync.run({COMPANY_ID:validateID,status:status});
			if(TriggerSync.data && TriggerSync.data.success == true){
				return true;
			}else{
				Configs.syncAlert =  "Could not access UiPath."
				//showAlert("Sync with ERP failure: Could not access UiPath.","error");
			}
		}else{
			Configs.syncAlert = "ERP-Sync Service was not available."
			//showAlert("Sync with ERP failure: ERP-Sync Service was not available.","error");
		}
		if(status === Configs.syncStatusIconMap["Pending Delete"].status){
			if(Configs.IS_THIRD_PARTY)
				Configs.syncErrorEscape = "Third Party Dashboard";
			else
				Configs.syncErrorEscape = "Company Dashboard";
		}
		Configs.syncErrorEscape = appsmith.URL.fullPath;

		return false;
	},
	confirmButtonClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(appsmith.URL.queryParams[Configs.editCompanyFlag]===undefined||appsmith.URL.queryParams[Configs.editCompanyFlag]==="TEMP"){
				//add
				await _1_COMPANY_NEW.run();
				if(_1_COMPANY_NEW.data != undefined && _1_COMPANY_NEW.data.length === 1){
					if(_1_COMPANY_NEW.data[0]["RESULT_CODE"] === "DONE"){
						await showAlert( "Save success","success");
						await removeValue(Configs.newCompanyTempFlag);
						if(await this.TriggerSync(_1_COMPANY_NEW.data[0].COMPANY_ID,Configs.syncStatusIconMap["Pending Add"].status)){
							await closeModal(MODAL_SAVE.name);
							showModal(MODAL_ADD_NEXT.name);
						}else{
							if(!_1_COMPANY_NEW.data[0].COMPANY_ID) return showAlert("Unknown Company ID","error");
							await closeModal(MODAL_SAVE.name);
							await navigateTo(appsmith.currentPageName, {[Configs.editCompanyFlag]:_1_COMPANY_NEW.data[0].COMPANY_ID}, 'SAME_WINDOW');
							showModal(MODAL_ALTER_SYNC.name);
						}
					}else{
						showAlert( "Save failed: "+_1_COMPANY_NEW.data[0]["RESULT_MESSAGES"],"error");
					}
				}else showAlert( "Unknown result code","error");

			}else{
				//edit
				await _2_COMPANY_UPDATE.run()
				if(_2_COMPANY_UPDATE.data != undefined && _2_COMPANY_UPDATE.data.length === 1){
					if(_2_COMPANY_UPDATE.data[0]["RESULT_CODE"] === "DONE"){
						await showAlert( "Save success","success");
						await closeModal(MODAL_SAVE.name);
						if(await this.TriggerSync(COMPANY_ID.text,Configs.syncStatusIconMap["Pending Edit"].status)){
							showModal(MODAL_continueEditing.name);				
						}else{
							showModal(MODAL_ALTER_SYNC.name);
						}
					}else{
						showAlert( "Save failed: "+(_2_COMPANY_UPDATE.data[0]["RESULT_MESSAGES"]),"error");
					}
				}else showAlert( "Unknown result code","error");
			}
		}
	},

	isArrayUndefinedOrEmpty:(array)=>{
		if(array != undefined && array.length !== 0){
			return false;
		}else{
			return true;
		}
	},
	keepChange:async ()=>{
		/*let datastr="data";
		let changedData = {
			...CONTAINER_COMPANY_INFORMATION[datastr],
			...CONTAINER_COMPANY_INFO[datastr],
			...Form_RemarkDetail[datastr],
			...Form_BillingDetail[datastr],
			"OVERWRITE_BILLING_ADDRESS":OVERWRITE_BILLING_ADDRESS.selectedOptionValue,
			"COMPANY_PROVINCE_TH":PROVINCE_TH.selectedOptionValue,
			"COMPANY_DISTRICT_TH":DISTRICT_TH.selectedOptionValue,
			"COMPANY_SUB_DISTRICT_TH":SUB_DISTRICT_TH .selectedOptionValue,
			"COMPANY_BUSINESS_TYPE_TH":await COMPANY_BUSINESS_TYPE.selectedOptionValue.split("/")[0]||"",
			"COMPANY_BUSINESS_TYPE_EN":await COMPANY_BUSINESS_TYPE.selectedOptionValue.split("/")[1]||"",
			"COMPANY_POSTAL_CODE":POSTAL_CODE.text,
			"BILLING_COMPANY_SUB_DISTRICT_TH":BILLING_SUB_DISTRICT_TH.selectedOptionValue,
			"BILLING_COMPANY_DISTRICT_TH":BILLING_DISTRICT_TH.selectedOptionValue,
			"BILLING_COMPANY_PROVINCE_TH":BILLING_PROVINCE_TH.selectedOptionValue,
			"BILLING_COMPANY_POSTAL_CODE":BILLING_POSTAL_CODE.text,
			"BILLING_COMPANY_BUILDING_NAME_EN":BCOMPANY_BUILDING_NAME_EN.text,
			"BILLING_COMPANY_BUILDING_NAME_TH":BCOMPANY_BUILDING_NAME_TH.text,
			"BILLING_COMPANY_BUSINESS_TYPE_TH":await BILLING_COMPANY_BUSINESS_TYPE.selectedOptionValue.split("/")[0]||"",
			"BILLING_COMPANY_BUSINESS_TYPE_EN":await BILLING_COMPANY_BUSINESS_TYPE.selectedOptionValue.split("/")[1]||""
		}*/
		let changedData = Object.fromEntries(
			Object.entries({...Company_Widgets,...CompanyBilling_Widgets}).map(([key, value]) => [key, value.data])
		);
		changedData.PRIORITY_CONTACT_ID = Configs.PRIORITY_CONTACT_ID??""
		//return changedData;
		await storeValue(Configs.newCompanyTempFlag,changedData,true);
	},
	onContactPageIndexChange:async ()=>{
		if(appsmith.URL.queryParams[Configs.editCompanyFlag]&&appsmith.URL.queryParams[Configs.editCompanyFlag]!=="TEMP"){
			//load LM
			await _6_SELECT_FOR_CONTACT_BY_COMID.run();
			if(_6_SELECT_FOR_CONTACT_BY_COMID.data != undefined)
			{
				let newTable = [];
				await Promise.all( _6_SELECT_FOR_CONTACT_BY_COMID.data.map(async (ele)=>{
					newTable.push(ele);
				}));
				storeValue("TABLE_COMPANY_CONTACT",newTable);
			}
		}else{
			//load contact temp
			await _5_SELECT_ALL_C_CONTACT_TEMP.run();
			if(_5_SELECT_ALL_C_CONTACT_TEMP.data != undefined){
				let newTable = [];
				await Promise.all(_5_SELECT_ALL_C_CONTACT_TEMP.data.map(async (ele)=>{
					newTable.push(ele);
				}));
				storeValue("TABLE_COMPANY_CONTACT",newTable);			
			}

		}
	},

	isFormChanges:()=>{
		if(Configs.showCompanyContact.filter(i=>i.TOTAL_RECORDS!==0).length===0 && (appsmith.URL.queryParams[Configs.editCompanyFlag]!=undefined &&appsmith.URL.queryParams[Configs.editCompanyFlag]!=="TEMP"))return false;
		if(appsmith.URL.queryParams[Configs.editCompanyFlag]==undefined ||appsmith.URL.queryParams[Configs.editCompanyFlag]==="TEMP")return false;
		console.log("pass1")
		if(Object.keys(Company_Widgets).find((key)=>{
			if(DefaultCompany[key] && DefaultCompany[key].data !== undefined){
				const widgetData = Company_Widgets[key].data===undefined||Company_Widgets[key].data===null?"":Company_Widgets[key].data.toString();
				const defaultData = _0_SELECT_FOR_COMPANY_BY_ID.data[0][key]===undefined||_0_SELECT_FOR_COMPANY_BY_ID.data[0][key]===null?
							"":_0_SELECT_FOR_COMPANY_BY_ID.data[0][key].toString();
				if(defaultData != widgetData && Company_Widgets[key].isVisible && !Company_Widgets[key].isDisable){
					console.log(key)
					return true;
				}
			}else return false;
		})) return true;
		console.log("pass2")
		if(!(SELECT_BILLING.data===undefined || SELECT_BILLING.data.length===0)){
			if(Object.keys(CompanyBilling_Widgets).find((key)=>{
				if(Default_COMPANY_BILLING[key] && Default_COMPANY_BILLING[key].data !== undefined){
					const widgetData = CompanyBilling_Widgets[key].data===undefined||CompanyBilling_Widgets[key].data===null?"":CompanyBilling_Widgets[key].data.toString();
					const defaultData = SELECT_BILLING.data[0][key]===undefined||SELECT_BILLING.data[0][key]===null?"":SELECT_BILLING.data[0][key].toString();
					if(defaultData != widgetData && CompanyBilling_Widgets[key].isVisible && !CompanyBilling_Widgets[key].isDisable){
						console.log(key)
						return true;
					}
				}else return false;
			}))return true;
		}

		console.log("pass3")
		let priorityContactID = Configs.showCompanyContact.find(i=>i["Contact ID"]===Configs.PRIORITY_CONTACT_ID);
		let priorityContactChange = priorityContactID?priorityContactID["Contact ID"]!==DefaultCompany.PRIORITY_CONTACT.data:DefaultCompany.PRIORITY_CONTACT.data!=="";
		if(priorityContactChange) return true;
		return false;
	},
	goToManageCompany:(preferState,editContactID)=>{
		let NEWBRANCH = "NEWBRANCH"
		let params = {AS:preferState,[Configs.editCompanyFlag]:_.trim(COMPANY_ID.text)||"TEMP",[Configs.editCompanyContactFlag]:editContactID}
		if(appsmith.store[NEWBRANCH])
			params = {...params,[NEWBRANCH]:appsmith.store[NEWBRANCH]}
		navigateTo('Manage Company Contact', 
							 params, 
							 'SAME_WINDOW');
	},
	onNewContactClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(this.isFormChanges()) return showAlert("Please save the company changes before managing contacts.","warning");

			await removeValue(Configs.editCompanyContactFlag)
			await storeValue(Configs.fromCompany, {"COMPANY_NAME":`${COMPANY_NAME_TH.text}/${COMPANY_NAME_EN.text}`,"COMPANY_ID":COMPANY_ID.text});
			await this.keepChange();
			this.goToManageCompany(Configs.contactPageState.AddContactTo);

		}
	},
	onEditContactClick: async()=>{
		if(this.isFormChanges()) return showAlert("Please save the company changes before managing contacts.","warning");

		//await storeValue(Configs.fromCompany, {"COMPANY_NAME":`${COMPANY_NAME_TH.text}/${COMPANY_NAME_EN.text}`,"COMPANY_ID":COMPANY_ID.text});
		await this.keepChange();
		this.goToManageCompany(Configs.contactPageState.EditContactOf,TABLE_CONTACT.tableData[TABLE_CONTACT.selectedRowIndex]['Contact ID']);
	},
	onDeleteBuutonClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			showModal(MODAL_DELETE.name);
		}
	},
	confirmDeleteCompanyClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			await _3_COMPANY_DELETE.run();
			if(_3_COMPANY_DELETE.data != undefined && _3_COMPANY_DELETE.data.length === 1){
				if(_3_COMPANY_DELETE.data[0]["RESULT_CODE"] === "DONE"){
					//showAlert( "Delete success","success");
					await closeModal(MODAL_DELETE.name);
					if(await this.TriggerSync(COMPANY_ID.text,Configs.syncStatusIconMap["Pending Delete"].status)){
						this.onClick_ButtonCancel();
					}else{
						showModal(MODAL_ALTER_SYNC.name);
					}
				}else{
					showAlert( "Delete failed."+_3_COMPANY_DELETE.data[0]["RESULT_MESSAGES"],"error");
				}
			}else showAlert( "Unknown result code","error");
		}
	},
	test:()=>{
		return appsmith.store[Configs.editCompanyFlag]
	}
}