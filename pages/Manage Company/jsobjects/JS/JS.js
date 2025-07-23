export default {
	onChangedLanguage:async()=>{
		DefaultCompany[ADDRESSING.PROVINCE_PROP_NAME].data = ADDRESSING.PROVINCE_WIDGET.selectedOptionValue
	},
	onClick_ButtonCancel:async ()=>{
		if(!Configs.IS_THIRD_PARTY)
			navigateTo('Company Dashboard', {}, 'SAME_WINDOW');
		else navigateTo('Third Party Dashboard', {}, 'SAME_WINDOW');
	},
	onClick_BUTTON_ADD_YES:async ()=>{
		await closeModal(MODAL_ADD_NEXT.name)
		navigateTo("Manage Company", {}, 'SAME_WINDOW');
		
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
			let alertWidget = await GlobalFunctions.manualValidateV2(DefaultCompany,Company_Widgets);
			let alertBilling = []
			if(OVERWRITE_BILLING_ADDRESS.selectedOptionValue=="true"){
				//let datastr = "data"
				alertBilling = await GlobalFunctions.manualValidateV2(Default_COMPANY_BILLING,CompanyBilling_Widgets);
				if(alertBilling.length > 0){
					showAlert(`Some field on billing information is required or invalid. ${JSON.stringify(alertBilling)}`)
					//alertWidget = [...alertWidget,...alertBilling]
				}
			}
			if(alertWidget.length > 0){
				showAlert(`Some field on company information is required or invalid. ${JSON.stringify(alertWidget)}`)
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
	confirmButtonClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(appsmith.URL.queryParams[Configs.editCompanyFlag]===undefined){
				//add
				await _1_COMPANY_NEW.run();
				if(_1_COMPANY_NEW.data != undefined && _1_COMPANY_NEW.data.length === 1){
					if(_1_COMPANY_NEW.data[0]["RESULT_CODE"] === "DONE"){
						await showAlert( "Save success","success");
						await removeValue(Configs.newCompanyTempFlag);
						await closeModal(MODAL_SAVE.name);
						showModal(MODAL_ADD_NEXT.name);
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
							if(!Configs.IS_THIRD_PARTY)
								navigateTo('Company Dashboard', {}, 'SAME_WINDOW');
							else navigateTo('Third Party Dashboard', {}, 'SAME_WINDOW');
						
						//showModal(MODAL_ADD_NEXT.name);
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
		let datastr="data";
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
		}
		await storeValue(Configs.newCompanyTempFlag,changedData,true);
	},
	onContactPageIndexChange:async ()=>{
		if(appsmith.URL.queryParams[Configs.editCompanyFlag]){
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
		if(appsmith.URL.queryParams[ Configs.editCompanyFlag]==undefined)return false;
		//let FormChanged = CONTAINER_COMPANY_INFORMATION.hasChanges || CONTAINER_COMPANY_INFO.hasChanges || Form_BillingDetail.hasChanges || Form_RemarkDetail.hasChanges;
		//let overwriteChange = OVERWRITE_BILLING_ADDRESS.selectedOptionValue != appsmith.store[ Configs.editCompanyFlag].OVERWRITE_BILLING_ADDRESS;
		//if(FormChanged && overwriteChange) return true;
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

			await removeValue(Configs.editCompanyContactFlag).then(async () => {
				await storeValue(Configs.fromCompany, {"COMPANY_NAME":`${COMPANY_NAME_TH.text}/${COMPANY_NAME_EN.text}`,"COMPANY_ID":COMPANY_ID.text});
				await this.keepChange();
				this.goToManageCompany(Configs.contactPageState.AddContactTo);
		})
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
					if(!Configs.IS_THIRD_PARTY)
						navigateTo('Company Dashboard', {}, 'SAME_WINDOW');
					else navigateTo('Third Party Dashboard', {}, 'SAME_WINDOW');
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