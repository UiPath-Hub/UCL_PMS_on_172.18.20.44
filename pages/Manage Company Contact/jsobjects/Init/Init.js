export default {
	pageLoad:async ()=>{
		Configs.startBody="LOADING";
		//const setToView = setTimeout(()=>{Configs.startBody="VIEW";},5000);
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		closeModal(MODAL_SAVE.name);
		setTimeout(CONTAINER_CONTACT_DETAIL.setVisibility(true),true);
		if(!await GlobalFunctions.sessionCheck())navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true)) navigateTo('Login', {}, 'SAME_WINDOW');


		let preferState=appsmith.URL.queryParams.AS;
		if(preferState){
			if(preferState==Configs.pageState.AddContactTo && appsmith.URL.queryParams.editCompany)
				Configs.pageState.CurrentState=Configs.pageState.AddContactTo;
			else if(preferState==Configs.pageState.EditContactOf && appsmith.URL.queryParams.editCompany){
				Configs.pageState.CurrentState=Configs.pageState.EditContactOf;
				
			}else if(preferState==Configs.pageState.NewContactAndBack && Configs.pageState.CurrentState == Configs.pageState.AddContactTo && appsmith.URL.queryParams.editCompany)
				Configs.pageState.CurrentState=Configs.pageState.NewContactAndBack;
		}
		if(!appsmith.URL.queryParams[Configs.editContacePerson]){
			let key = await Object.keys(DefaultContact);
			await Promise.all(key.map(field=>DefaultContact[field].data=""))
		}
		await this.initDefault();
		await ADDRESSING.initAddress();		
		
		Configs.startBody="VIEW";
		resetWidget(Form.widgetName,true);
		//clearTimeout(setToView);


	},

	initDefault:async ()=>{
		if(appsmith.URL.queryParams[Configs.editContacePerson] !== undefined){
			
			await _00_SP_SELECT_FOR_CONTACT.run({COMPANY_CONTACT_ID:appsmith.URL.queryParams[Configs.editContacePerson]})
			let data = _00_SP_SELECT_FOR_CONTACT.data[0];
			if(Configs.pageState.CurrentState==Configs.pageState.EditContactOf){
				await _01_SELECT_CONTACT_PERSON_DE.run();
				data = {...data,COMPANY_CONTACT_ROLE:_01_SELECT_CONTACT_PERSON_DE.data[0].COMPANY_CONTACT_ROLE}
			}
			
			if(data != undefined){
				let InitializationEntityList = [{ENTITY:DefaultContact,DATA: data}];
				await GlobalFunctions.initDefault(InitializationEntityList);
				_09_SELECT_COMPANYS_OF_CONTACT.run();
			}


		}else{
			let InitializationEntityList = [{ENTITY:DefaultContact,DATA: {}}];
			await GlobalFunctions.initDefault(InitializationEntityList);
		}

	},
	tst:()=>appsmith.URL.queryParams
}