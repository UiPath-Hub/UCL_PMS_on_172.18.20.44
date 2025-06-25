export default {
	V:1,
	LastChanged:"",
	manualValidate:async (defaultEntities,widgetsGroupForm)=>{
		let alert = [];
		await Promise.all( Object.keys(defaultEntities).map(async (key)=>{
			let data = widgetsGroupForm.data[key.toString()];
			if (data !== null && data !== undefined) {
				const element = defaultEntities[key.toString()];
				const trimmedData = _.trim(data);
				const regex = _.trim(element.regex);
				if ((element.required && trimmedData === "") || 
						(regex !== "" && !RegExp(regex).test(trimmedData))) {
					if(defaultEntities[key.toString()].color!=Configs.requiredColorAlert){
						defaultEntities[key.toString()].data = data
						defaultEntities[key.toString()].color = Configs.requiredColorAlert;
					}
					alert.push(key.toString());
				} else {
					if(defaultEntities[key.toString()].color!=Configs.requiredColorPass){
						defaultEntities[key.toString()].data = data
						defaultEntities[key.toString()].color = Configs.requiredColorPass;
					}
				}
			}
		}))
		return alert;
	},
	setAttributes:async (DefaultEntity,defaultData,attributeType)=>{
		if(!attributeType) attributeType="data";
		await Promise.all( Object.keys(DefaultEntity).map(async(key)=>{
			let keystr= key.toString();
			if(defaultData[keystr] != undefined && DefaultEntity[keystr][attributeType] != undefined){	
				DefaultEntity[keystr][attributeType] = defaultData[keystr];
			}}))
	},
	initDefault:async(InitializationDataList)=>{
		//run all default data query before calling
		//load validation
		if(!SELECT_FIELDS_VALIDATION || !Configs.pageName)return showAlert("SELECT_FIELDS_VALIDATION or Configs.pageName not found.","error");
		await SELECT_FIELDS_VALIDATION.run();
		let regex = {};
		let required = {};		
		if(SELECT_FIELDS_VALIDATION.data){
			await Promise.all(SELECT_FIELDS_VALIDATION.data.map(async (ele)=>{
				regex[ele.FIELD_NAME] = ele.REGEX;
				required[ele.FIELD_NAME] = ele.REQUIRED;
			}))
		}
		
		await Promise.all(InitializationDataList.map(async (InitializationData)=>{
			if(!InitializationData.DATA || !InitializationData.ENTITY) return console.error("Invalid InitializationData.");
			await Promise.all([this.setAttributes(InitializationData.ENTITY,InitializationData.DATA,"data"),
												 this.setAttributes(InitializationData.ENTITY,regex,"regex"),
												 this.setAttributes(InitializationData.ENTITY,required,"required")]);
		}));

	}
	,
	sessionCheck:async ()=>{
		if(appsmith.store["userSession"] && appsmith.store["userSession"].EMAIL== appsmith.user.email){
			await SP_HANDLE_TOKEN.run();
			if(SP_HANDLE_TOKEN.data && SP_HANDLE_TOKEN.data[0].TOTAL_RECORD > 0 && SP_HANDLE_TOKEN.data[0].RESULT_CODE == undefined){
				let SESSION = appsmith.store["userSession"];//{TOKEN:"",PERMISSIONS:[]};
				if(SP_HANDLE_TOKEN.data[0].TOKEN == '' || SP_HANDLE_TOKEN.data[0].TOKEN == null){
					Configs.forceLogin = true;
					showModal(Modal_Session_detail.name);
				}else{
					SESSION.TOKEN = SP_HANDLE_TOKEN.data[0].TOKEN;
					SESSION.PERMISSIONS = SP_HANDLE_TOKEN.data.map((ele)=>ele.PERMISSION_ID);
				}
				await storeValue(Configs.userSession,SESSION);
				return true;
			}else{
				if(SP_HANDLE_TOKEN.data[0].RESULT_CODE){
					showAlert(SP_HANDLE_TOKEN.data[0].RESULT_CODE,"error");
				}
				Configs.forceLogin = true;
				showModal(Modal_Session_detail.name);
				return true;
			}
		}else return false;
	},
	on_ModalSessionDetailClose:()=>{
		if(Configs.forceLogin) navigateTo('Login', {}, 'SAME_WINDOW')
	},
	permissionsCheck:(Permission,forceKick)=>{
		let PERMISSIONS = appsmith.store["userSession"].PERMISSIONS;
		if(! PERMISSIONS.includes(Permission)){
			Configs.errorAlert = "You do not have a permission to access this content. Please contact admin."
			Configs.forceKick=forceKick;
			showModal(Modal_ErrorAlert.name);
			return false;
		}else return true;
	},
	on_ModalPermissionDeniedClose:()=>{
		if(Configs.forceKick) navigateTo('Home', {}, 'SAME_WINDOW');
	},
}