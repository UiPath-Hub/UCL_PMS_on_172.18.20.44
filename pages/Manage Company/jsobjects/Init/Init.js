export default {
	PageLoad:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		Configs.startBody = "LOADING"
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;

		await SELECT_PROVINCEs.run();
		await this.initDefault();
		await JS_BILLING.initDefault();
		await ADDRESSING.initAddress();
		await ADDRESSING_BILLING.initAddress();
		if(appsmith.URL.queryParams.NEWBRANCH=== undefined){
			//NEWBRANCH:moment().format("DDMMYYYYmmss").toString()
			storeValue("test",moment.now().toString(),false);
			showAlert(appsmith.store.test);
		}

		if(appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
			await Promise.all([VerifyButton1.onClick(),VerifyButton2.onClick(),VerifyButton3.onClick()])			
		}
		Configs.startBody= "VIEW"
		resetWidget(Body.widgetName,true);

	},

	initDefault:async ()=>{
		if(appsmith.store[Configs.newCompanyTempFlag] != undefined && appsmith.URL.queryParams[ Configs.editCompanyFlag]==undefined){
			//temp and load editing before manage contacts
			const initContact =async ()=>{
				//load contact temp
				await _5_SELECT_ALL_C_CONTACT_TEMP.run();
				let newContactList = [];
				await Promise.all(_5_SELECT_ALL_C_CONTACT_TEMP.data.map(async (ele)=>{
					await newContactList.push(ele);
				}))
				Configs.showCompanyContact =newContactList;
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
					let newContactList = [];
					await Promise.all( _6_SELECT_FOR_CONTACT_BY_COMID.data.map(async (ele)=>{
						await newContactList.push(ele);
					}))
					console.log("newContactList")
					Configs.showCompanyContact =newContactList;
					return;
				}
			}

			await Promise.all([initDefault(),initExistContact(),_4_CONTACT_TEMP_DELETE.run()])
			console.log("init LM")
		}else{
			//New
				let InitializationEntityList = [{ENTITY:DefaultCompany,DATA: {}}];
				await GlobalFunctions.initDefaultV2(InitializationEntityList);
			_4_CONTACT_TEMP_DELETE.run();
		}
	}
}