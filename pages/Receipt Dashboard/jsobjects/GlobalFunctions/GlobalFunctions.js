export default {
	V:4,
	LastChanged:"if(!SELECT_FIELDS_VALIDATION.data) before run in init()",

	manualValidateV2:async (defaultEntities,widgetsMap)=>{
		let alert = [];
		await Promise.all( Object.keys(defaultEntities).map(async (key)=>{
			let keystr = key.toString();
			if(widgetsMap[keystr]===undefined) return;
			if(widgetsMap[keystr].widgetName===undefined)return;
			
			let data = widgetsMap[keystr].data=== undefined?"":widgetsMap[keystr].data;
			const log = {};
			log.key = keystr;
			log.valid = widgetsMap[keystr].isValid;
			log.disable = widgetsMap[keystr].isDisabled;
			log.visible = widgetsMap[keystr].isVisible;
			log.data = data;
			//console.log(log); 
			//find widget of the field by get from widget name of widgetMap
			//let widgetName = widgetsMap[keystr].widgetName;
			defaultEntities[keystr].data = data
			if (!widgetsMap[keystr].isValid && !widgetsMap[keystr].isDisabled && widgetsMap[keystr].isVisible) {
				if(defaultEntities[keystr].color!=Configs.requiredColorAlert){
					defaultEntities[keystr].color = Configs.requiredColorAlert;
				}
				alert.push(widgetsMap[keystr].label||_.toLower( widgetsMap[keystr].widgetName).replaceAll("_"," "));
			} else {
				if(defaultEntities[keystr].color!=Configs.requiredColorPass){
					defaultEntities[keystr].color = Configs.requiredColorPass;
				}
			}
			
		}))
		//console.log(alert)
		return alert;
	},
	manualValidate:async (defaultEntities,widgetsGroupForm)=>{
		let alert = [];
		await Promise.all( Object.keys(defaultEntities).map(async (key)=>{
			let keystr = key.toString();
			let data = widgetsGroupForm.data[keystr];
			if (data !== null && data !== undefined) {
				const element = defaultEntities[keystr];
				const trimmedData = _.trim(data);
				const regex = _.trim(element.regex);
				if ((element.required && trimmedData === "") || 
						(regex !== "" && !RegExp(regex).test(trimmedData))) {
					if(defaultEntities[keystr].color!=Configs.requiredColorAlert){
							defaultEntities[keystr].data = data
							defaultEntities[keystr].color = Configs.requiredColorAlert;							
					}
					alert.push(keystr);
				} else {
					if(defaultEntities[keystr].color!=Configs.requiredColorPass){
						defaultEntities[keystr].data = data
						defaultEntities[keystr].color = Configs.requiredColorPass;
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
			
			if(defaultData[keystr] !== undefined && DefaultEntity[keystr][attributeType] !== undefined && defaultData[keystr] !== null){
				DefaultEntity[keystr][attributeType] = defaultData[keystr];
			}else if(DefaultEntity[keystr][attributeType] !== undefined && attributeType==="data"){
				DefaultEntity[keystr][attributeType]="";
			}
		}))
	},
	
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