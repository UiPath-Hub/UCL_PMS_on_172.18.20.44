export default {
	afterSyncErrorNotify:async ()=>{
		const pageName = Configs.syncedErrorEscape.pageName;
		const params = {...Configs.syncedErrorEscape.params};
		const nextModal = Configs.syncedErrorEscape.nextModal;
		Configs.syncedErrorEscape.pageName = appsmith.currentPageName;
		Configs.syncedErrorEscape.params = {};
		Configs.syncedErrorEscape.nextModal = "";
		
		if( nextModal != "" && nextModal != undefined){
			showModal(nextModal);
		}else if(pageName===appsmith.currentPageName){
			await navigateTo(appsmith.currentPageName,params);
			navigateTo(appsmith.URL.fullPath,{});
		}else{
			navigateTo(pageName,params);
		}
	},
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
	
	GETstate:{loop:0,finish:1,failed:2},
	delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

	getTransactionStatus: async (retriesCount,eventID)=>{
		if(retriesCount>= Configs.MaxHTTPResquestOfCheckingStatus) return this.GETstate.failed; // ใช้ this.GETstate

		// StatusCheck คือ API call ไปที่ /status/:id
		try{
			await StatusCheck.run({ID:eventID}); 
		}catch(err){
			console.log(err);
		}
		

		// สมมติว่า StatusCheck.data มีโครงสร้างตาม Response ที่ออกแบบไว้
		if(StatusCheck.data && StatusCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.statusCheck_checkReturnName]=== appsmith.store.RPA_SYNC_STATUS.constantKeys.statusCheck_returnOKstatus){
			return this.GETstate.finish;
		}else if(StatusCheck.data && StatusCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.statusCheck_checkReturnName]=== appsmith.store.RPA_SYNC_STATUS.constantKeys.statusCheck_returnFailedStatus){
			return this.GETstate.failed;
		}else{
			return this.GETstate.loop;
		}
	},
	TriggerSync:async(validateID,status)=>{
		try{
			// 1. Health Check
			await HealthCheck.run({COMPANY_ID:validateID});
			if(HealthCheck.data && HealthCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_checkReturnName]===appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_returnOKstatus && HealthCheck.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.healthCheck_returnCompanyIDName] === validateID){

				// 2. Trigger Sync (ส่ง Transaction เข้าคิว)
				await TriggerSync.run({COMPANY_ID:validateID,status:status});

				if(TriggerSync.data && TriggerSync.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.sync_checkReturnName] === appsmith.store.RPA_SYNC_STATUS.constantKeys.sync_returnOKstatus){

					const eventID = TriggerSync.data[appsmith.store.RPA_SYNC_STATUS.constantKeys.sync_checkReturnName_ID];
					let retriesCount = 0;
					let statusState = this.GETstate.loop;

					// ************************************************
					// * Start Polling Loop (การตรวจสอบสถานะซ้ำๆ) *
					// ************************************************

					while (statusState === this.GETstate.loop) {				
						statusState = await this.getTransactionStatus(retriesCount, eventID);
						if (statusState === this.GETstate.finish) {
							return true; // สำเร็จ
						}
						if (statusState === this.GETstate.failed) {
							// ล้มเหลวเนื่องจากสถานะจาก Server หรือจำนวนครั้ง Polling เกิน
							Configs.syncdErrorMessage = appsmith.store.RPA_SYNC_STATUS.syncAlert.apiError
							return false; 
						}
						await this.delay(Configs.PollingDelayInMilliseconds); 
						retriesCount++;
						// หากยังเป็น this.GETstate.loop จะวนซ้ำ
					}

					// ในทางทฤษฎีโค้ดไม่ควรมาถึงตรงนี้ แต่ป้องกันไว้
					if (statusState === this.GETstate.finish) return true;
					Configs.syncdErrorMessage = appsmith.store.RPA_SYNC_STATUS.syncAlert.apiError
					return false; // Fail safe

				}
			}
			Configs.syncdErrorMessage = appsmith.store.RPA_SYNC_STATUS.syncAlert.unhealthy
			return false; // Health check หรือ Trigger Sync ล้มเหลว
		}catch(err){
			console.error("TriggerSync failed:", err);
			Configs.syncdErrorMessage = appsmith.store.RPA_SYNC_STATUS.syncAlert.unhealthy
			return false; // Error ระหว่าง Health check หรือ Trigger Sync
		}
	},
	confirmButtonClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(Configs.isNewCompany()){
				//add
				await _01_COMPANY_NEW.run();
				if(_01_COMPANY_NEW.data != undefined && _01_COMPANY_NEW.data.length === 1){
					if(_01_COMPANY_NEW.data[0]["RESULT_CODE"] === "DONE"){
						const close = async ()=>{
							await Promise.all([removeValue(Configs.newCompanyTempFlag),closeModal(MODAL_SAVE.name),showAlert( "Save success","success")]) ;
						}
						if(await this.TriggerSync(_01_COMPANY_NEW.data[0].COMPANY_ID,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Add"].status)){
							await close();
							showModal(MODAL_ADD_NEXT.name);
						}else{
							if(!_01_COMPANY_NEW.data[0].COMPANY_ID) return showAlert("Unknown Company ID","error");
							await close();
							//Configs.syncedErrorEscape.pageName = appsmith.currentPageName;
							Configs.syncedErrorEscape.params = {[Configs.editCompanyFlag]:_01_COMPANY_NEW.data[0].COMPANY_ID}
							Configs.syncedErrorEscape.nextModal = MODAL_ADD_NEXT.name;
							showModal(MODAL_ALTER_SYNC.name);
						}
					}else{
						showAlert( "Save failed: "+_01_COMPANY_NEW.data[0]["RESULT_MESSAGES"],"error");
					}
				}else showAlert( "Unknown result code","error");

			}else{
				//edit
				await _02_COMPANY_UPDATE.run()
				if(_02_COMPANY_UPDATE.data != undefined && _02_COMPANY_UPDATE.data.length === 1){
					const close=async ()=>{
						await Promise.all([showAlert( "Save success","success"),closeModal(MODAL_SAVE.name)]);
					}
					if(_02_COMPANY_UPDATE.data[0]["RESULT_CODE"] === "DONE"){
						if(await this.TriggerSync(COMPANY_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Edit"].status)){
							await close();
							showModal(MODAL_continueEditing.name);			
						}else{
							await close();
							Configs.syncedErrorEscape.pageName = appsmith.URL.fullPath;
							Configs.syncedErrorEscape.params = {}
							Configs.syncedErrorEscape.nextModal = MODAL_continueEditing.name;
							showModal(MODAL_ALTER_SYNC.name);
						}
					}else{
						showAlert( "Save failed: "+(_02_COMPANY_UPDATE.data[0]["RESULT_MESSAGES"]),"error");
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
		let changedData = Object.fromEntries(
			Object.entries({...Company_Widgets,...CompanyBilling_Widgets}).map(([key, value]) => [key,value.data])
		);
		changedData.PRIORITY_CONTACT_ID = Configs.PRIORITY_CONTACT_ID??""
		//return changedData;
		await storeValue(Configs.newCompanyTempFlag,changedData,true);
	},
	onContactPageIndexChange:async ()=>{
		if(appsmith.URL.queryParams[Configs.editCompanyFlag]&&appsmith.URL.queryParams[Configs.editCompanyFlag]!=="TEMP"){
			//load LM
			await _06_SELECT_FOR_CONTACT_BY_COMI.run();
			if(_06_SELECT_FOR_CONTACT_BY_COMI.data != undefined)
			{
				let newTable = [];
				await Promise.all( _06_SELECT_FOR_CONTACT_BY_COMI.data.map(async (ele)=>{
					newTable.push(ele);
				}));
				storeValue("TABLE_COMPANY_CONTACT",newTable);
			}
		}else{
			//load contact temp
			await _05_SELECT_ALL_C_CONTACT_TEMP.run();
			if(_05_SELECT_ALL_C_CONTACT_TEMP.data != undefined){
				let newTable = [];
				await Promise.all(_05_SELECT_ALL_C_CONTACT_TEMP.data.map(async (ele)=>{
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
				const defaultData = _00_SELECT_FOR_COMPANY_BY_ID.data[0][key]===undefined||_00_SELECT_FOR_COMPANY_BY_ID.data[0][key]===null?
							"":_00_SELECT_FOR_COMPANY_BY_ID.data[0][key].toString();
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
			await _03_COMPANY_DELETE.run();
			if(_03_COMPANY_DELETE.data != undefined && _03_COMPANY_DELETE.data.length === 1){
				const close=async ()=>{
					await closeModal(MODAL_DELETE.name);
				}
				if(_03_COMPANY_DELETE.data[0]["RESULT_CODE"] === "DONE"){
					//showAlert( "Delete success","success");

					if(await this.TriggerSync(COMPANY_ID.text,appsmith.store.RPA_SYNC_STATUS.syncStatusIconMap["Pending Delete"].status)){
						await close();
						this.onClick_ButtonCancel();
					}else{
						await close();
						if(Configs.IS_THIRD_PARTY){
							Configs.syncedErrorEscape.pageName = "Third Party Dashboard";
							Configs.syncedErrorEscape.params = {}
						
						}
						else{
							Configs.syncedErrorEscape.pageName = "Company Dashboard";
							Configs.syncedErrorEscape.params = {}
						}
						showModal(MODAL_ALTER_SYNC.name);
					}
				}else{
					showAlert( "Delete failed."+_03_COMPANY_DELETE.data[0]["RESULT_MESSAGES"],"error");
				}
			}else showAlert( "Unknown result code","error");
		}
	},
	test:()=>{
		return appsmith.store[Configs.editCompanyFlag]
	}
}