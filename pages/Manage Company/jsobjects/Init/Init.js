export default {
	PageLoad:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		Configs.startBody = "LOADING"
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		closeModal(Modal_NeedPriorityContact.name);
		closeModal(MODAL_continueEditing.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;

		Configs.loadingProgress.current = Configs.loadingProgress.default;
		await SELECT_PROVINCEs.run();
		Configs.loadingProgress.current +=1;
		await this.initDefault();
		Configs.loadingProgress.current +=1;
		await JS_BILLING.initDefault();
		Configs.loadingProgress.current +=1;
		await ADDRESSING.initAddress();
		Configs.loadingProgress.current +=1;
		await ADDRESSING_BILLING.initAddress();
		Configs.loadingProgress.current +=1;

		//set default icon of sync status.
		const setDefaultIconOfSyncStatus=async ()=>{
			await SP_DD_RPA_SYNC_STATUS.run();	
			if(SP_DD_RPA_SYNC_STATUS.data && SP_DD_RPA_SYNC_STATUS.data.length > 0){
				SP_DD_RPA_SYNC_STATUS.data.forEach(e=>{
					if(Configs.syncStatusIconMap[e.SYSTEM_VALUE]!==undefined || Configs.syncStatusIconMap[e.SYSTEM_VALUE]!== null){
						Configs.syncStatusIconMap[e.SYSTEM_VALUE].status = e.FIXED_VALUE;
					}
				})

			}
			Configs.loadingProgress.current +=1;
		}


		const newbranch =async ()=>{
			if(appsmith.URL.queryParams.NEWBRANCH === undefined){
				await storeValue("NEWBRANCH",moment.now().toString(),false);
				//await _5_SELECT_ALL_C_CONTACT_TEMP.run();
				Configs.loadingProgress.current +=1;
			}
		}
		const editbranch = async ()=>{
			if(appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
				await Promise.all([VerifyButton1.onClick(),VerifyButton2.onClick(),VerifyButton3.onClick()])
				Configs.loadingProgress.current +=1;
			}
		}

		if(appsmith.URL.queryParams[Configs.editCompanyFlag]==="TEMP"){
			await navigateTo(appsmith.currentPageName, {...appsmith.URL.queryParams,[Configs.editCompanyFlag]:undefined}, 'SAME_WINDOW');
		}

		let InitializationEntityList = [{ENTITY: Default_Profile,DATA: {}}];
		await Promise.all([newbranch(),editbranch(),GlobalFunctions.initDefaultV2(InitializationEntityList),setDefaultIconOfSyncStatus()]);
		Configs.loadingProgress.current +=1;

		if(Configs.showCompanyContact.filter(i=>i.TOTAL_RECORDS!==0).length===0 && appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
			Configs.errorAlert = 'Editing company/third-party data without a valid priority contact person will cause data lost while saving. Please add at least one contact person before editing.'
			showModal(Modal_ErrorAlert.name);
		}
		Configs.startBody= "VIEW"
		resetWidget(Body.widgetName,true);

	},

	initDefault:async ()=>{
		if(appsmith.store[Configs.newCompanyTempFlag] != undefined && appsmith.URL.queryParams[ Configs.editCompanyFlag]=="TEMP"){
			//temp and load editing before manage contacts
			const initContact =async ()=>{
				//load contact temp
				await _5_SELECT_ALL_C_CONTACT_TEMP.run();
				if(_5_SELECT_ALL_C_CONTACT_TEMP.data != undefined){
					Configs.showCompanyContact =_5_SELECT_ALL_C_CONTACT_TEMP.data;

				}else Configs.showCompanyContact=[]
				if(appsmith.store[Configs.newCompanyTempFlag].PRIORITY_CONTACT_ID){ 
					Configs.PRIORITY_CONTACT_ID = appsmith.store[Configs.newCompanyTempFlag].PRIORITY_CONTACT_ID;
					JS.sortPriorityContact();
				}
				return;
			}
			let InitializationEntityList = [{ENTITY:DefaultCompany,DATA: appsmith.store[Configs.newCompanyTempFlag]}];
			await Promise.all([
				GlobalFunctions.initDefaultV2(InitializationEntityList),
				initContact()
			])
			console.log("init temp");

		}else if(appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
			//LM
			const initDefault =async ()=>{
				await _0_SELECT_FOR_COMPANY_BY_ID.run()
				console.log("SP_SELECT_FOR_COMPANY_BY_ID");
				let InitializationEntityList = [{ENTITY:DefaultCompany,DATA: _0_SELECT_FOR_COMPANY_BY_ID.data[0]}];
				await GlobalFunctions.initDefaultV2(InitializationEntityList);

			}
			const initExistContact =async ()=>{
				//load contact LM
				await _6_SELECT_FOR_CONTACT_BY_COMID.run();
				console.log("SP_SELECT_FOR_CONTACT_BY_COMID")
				if(_6_SELECT_FOR_CONTACT_BY_COMID.data != undefined)
				{
					Configs.showCompanyContact =_6_SELECT_FOR_CONTACT_BY_COMID.data;
					return;
				}else Configs.showCompanyContact=[]

			}

			await Promise.all([initDefault(),initExistContact(),_4_CONTACT_TEMP_DELETE.run()])
			const PRIORITY_CONTACT_ID = Configs.showCompanyContact.find((i)=> i["Contact ID"] === _0_SELECT_FOR_COMPANY_BY_ID.data[0].PRIORITY_CONTACT);
			if(PRIORITY_CONTACT_ID!==undefined){
				Configs.PRIORITY_CONTACT_ID = PRIORITY_CONTACT_ID["Contact ID"];
				JS.sortPriorityContact()
			}else{
				Configs.PRIORITY_CONTACT_ID=""
			}
			console.log("init LM")
		}else{
			//New
			let InitializationEntityList = [{ENTITY:DefaultCompany,DATA: {}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);
			_4_CONTACT_TEMP_DELETE.run();
		}

		//Configs.showCompanyContact = (appsmith.URL.queryParams[Configs.editCompanyFlag]==undefined?_5_SELECT_ALL_C_CONTACT_TEMP.data:_6_SELECT_FOR_CONTACT_BY_COMID.data!=undefined?_6_SELECT_FOR_CONTACT_BY_COMID.data:Default_Table.TABLE_CONTACT).filter(row=>row.TOTAL_RECORDS!=0)
	}
}