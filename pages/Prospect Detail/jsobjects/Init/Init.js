export default {
	dataDisplayStartTime:moment("2021-01-01",Configs.dateFormat),
	SINGLE_PAGE:"SINGLE_PAGE",
	userSession:"userSession",
	ID:"PROSPECTS_ID",
	PageLoad:async ()=>{
		SinglePageValueDefault.ProgressbarMax = this.LoadProgress.length+1;
		SinglePageValueDefault.CurrentProgressbar = 0;
		await storeValue(this.SINGLE_PAGE,{...SinglePageValueDefault,
																			 recentPage:(appsmith.store?.[this.SINGLE_PAGE]?.recentPage && _.last(appsmith.store?.[this.SINGLE_PAGE]?.recentPage)!==Configs.pageName)?
																			 [...appsmith.store[this.SINGLE_PAGE].recentPage,Configs.pageName]:SinglePageValueDefault.recentPage
																			},false);
		await resetWidget(Progress1.widgetName);
		Configs.AllModals.forEach(async(modalName)=>{
			await closeModal(modalName);
			await resetWidget(modalName,true);
		});
		await this.sessionCheck();
		if(!this.permissionsCheck(Configs.permissions.VIEW,true))return;
		let progressIndex = 0;
		while(progressIndex < this.LoadProgress.length){
			await this.LoadProgress[progressIndex]();

			//next loop
			SinglePageValueDefault.CurrentProgressbar = SinglePageValueDefault.CurrentProgressbar+1
			progressIndex++;
		}
		SinglePageValueDefault.CurrentProgressbar = SinglePageValueDefault.CurrentProgressbar+1
		this.ShowView();
	},

	//////////////// Register Load functions here! //////////////////////////////
	LoadProgress:[this.LoadData,ADDRESSING.initAddress,this.LoadTableLog],
	LoadData:async()=>{
		if(appsmith.URL.queryParams[this.ID] != undefined && _.last(appsmith.store[this.SINGLE_PAGE]?.recentPage) === Configs.pageName){
			let ID = _.trim(appsmith.URL.queryParams[this.ID]);
			if(ID !== ""){
				let data = await SER_SEARCH_FOR_PROSPECTS.run({ID:ID});
				
				if(data[0].TOTAL_RECORDS === 1){
					let InitializationDataList = [{ENTITY:Widgets_Value.PMS_PROSPECTS_LM, DATA: data[0]}]
					await GlobalFunctions.initDefaultV2(InitializationDataList);
					
					//special field
					Widgets_Value.PMS_PROSPECTS_LM.CHECKBOX_OTHER_UTILITY_NEED.data = ["WATER_SUPPLY","COOKING_GAS","AIR_CONDITIONS"].filter((fieldName)=>Widgets_Value.PMS_PROSPECTS_LM?.[fieldName]?.data===true);
					return true;
				}else{
					//Show Invalid ID
				}
			}
		}
		await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":false,"errorAlert":`Invalid ${this.ID}, no data.`},false);
		showModal(Modal_ErrorAlert.name);
		return false;
	},
	LoadTableLog:async ()=>{
		await JS.loadTable("PROSPECTS_ACTIONLOGS");
		resetWidget(PROSPECTS_ACTIONLOGS.widgetName);
		return true;
	},
	ShowView:async()=>{
		await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE], BodyInit: "VIEW"},false);
		resetWidget(Body.widgetName,true);
		return true;
	},
	sessionCheck:async ()=>{
		if(appsmith.store[this.userSession] && appsmith.store[this.userSession].EMAIL== appsmith.user.email){
			await SP_HANDLE_TOKEN.run();
			if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
				let SESSION = appsmith.store[this.userSession];//{TOKEN:"",PERMISSIONS:[]};
				if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
					await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":true},false);
					showModal(Modal_Session_detail.name);
				}else{
					SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
					SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				}
				await storeValue(this.userSession,SESSION);
				//navigateTo('Login', {}, 'SAME_WINDOW');
			}else{
				if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
					showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
				}
				await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":true},false);
				showModal(Modal_Session_detail.name);
			}
		}else navigateTo('Login', {}, 'SAME_WINDOW');
	},
	on_ModalSessionDetailClose:async()=>{
		//"appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName" use to ensure the Pageload function was already run.
		if(appsmith.store[this.SINGLE_PAGE]?.recentPage && _.last(appsmith.store[this.SINGLE_PAGE]?.recentPage)===Configs.pageName&&
			 appsmith.store[this.SINGLE_PAGE]?.forceLogin===true){
			await storeValue("REDIRECT_SIGNIN",appsmith.URL.fullPath,false);
			navigateTo('Login', {}, 'SAME_WINDOW');		
		}

	},
	on_ModalPermissionDeniedClose:async()=>{
		//"appsmith.store[this.SINGLE_PAGE]?.recentPage===Configs.pageName" use to ensure the Pageload function was already run.
		if(appsmith.store[this.SINGLE_PAGE]?.recentPage && _.last(appsmith.store[this.SINGLE_PAGE]?.recentPage)===Configs.pageName&&
			 appsmith.store[this.SINGLE_PAGE]?.forceLogin===true)
		{
			navigateTo('Login', {}, 'SAME_WINDOW');					
		}

	},
	permissionsCheck:async(Permission,forceKick)=>{
		let PERMISSIONS = appsmith.store[this.userSession].PERMISSIONS;
		if(! PERMISSIONS.includes(Permission)){
			await storeValue(this.SINGLE_PAGE,{...appsmith.store[this.SINGLE_PAGE],"forceLogin":forceKick,"errorAlert":"You do not have a permission to access this content. Please contact admin."},false);
			showModal(Modal_ErrorAlert.name);
			return false;
		}else return true;
	},
}