export default {
	V:5,
	LastChanged:"OnResetObject",
	OnResetObject:(ob_running, ob_default)=> {
		// 1. วนซ้ำผ่าน Properties ของ ob_default (ซึ่งก็คือ 'box1', 'box2')
		for (const key in ob_default) {
			// ตรวจสอบว่า Property นั้นเป็นของ Object จริงๆ (ไม่ใช่ Property ที่ถูกสืบทอดมา)
			if (ob_default.hasOwnProperty(key)) {
				const defaultValue = ob_default[key];
				const runningValue = ob_running[key];

				// 2. ตรวจสอบว่า Property นั้นเป็น Object หรือไม่ (เช่น box1, box2)
				if (typeof defaultValue === 'object' && defaultValue !== null) {
					// ถ้าเป็น Object: ทำการ Deep Copy
					// 3. วนซ้ำภายใน Object ย่อย (เช่น 'name', 'value' ภายใน box1)
					for (const subKey in defaultValue) {
						if (defaultValue.hasOwnProperty(subKey)) {
							// 4. กำหนดค่าจาก ob_default[key][subKey] ไปที่ ob_running[key][subKey]
							// **นี่คือส่วนสำคัญที่ทำให้ไม่เปลี่ยน Reference ของ ob_running และ ob_running.box1/box2**
							if (runningValue && runningValue.hasOwnProperty(subKey)) {
								runningValue[subKey] = defaultValue[subKey];
							}
						}
					}
				} else {
					// ถ้าไม่ใช่ Object (เช่น String, Number, Boolean) ให้กำหนดค่าโดยตรง
					ob_running[key] = defaultValue;
				}
			}
		}
	},
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
				alert.push(widgetsMap[keystr]);
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
	//InitializationDataList = [{ENTITY:Appsmith JS Object, DATA: {propName:any}}]
	initDefaultV2:async(InitializationDataList)=>{
		//run all default data query before calling
		//load validation
		if(!SELECT_FIELDS_VALIDATION || !Configs.pageName)return showAlert("SELECT_FIELDS_VALIDATION or Configs.pageName not found.","error");
		//if(SELECT_FIELDS_VALIDATION.data == undefined)
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