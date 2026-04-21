export default {
	V:5,
	LastChanged:"if(!SELECT_FIELDS_VALIDATION.data) before run in init()",
	manualValidate:async (defaultEntities,widgetsMap)=>{
		let alert = [];
		await Promise.all( Object.keys(defaultEntities).map(async (key)=>{
			let keystr = key.toString();
			if(!widgetsMap[keystr]) return;
			if(!widgetsMap[keystr].widgetName)return;

			let data = widgetsMap[keystr].data||"";
			const log = {};
			log.key = keystr;
			log.valid = widgetsMap[keystr].isValid;
			log.disable = widgetsMap[keystr].isDisabled;
			log.visible = widgetsMap[keystr].isVisible;
			log.data = data;
			console.log(log); 
			//find widget of the field by get from widget name of widgetMap
			//let widgetName = widgetsMap[keystr].widgetName;
			defaultEntities[keystr].data = data
			if (!widgetsMap[keystr].isValid && !widgetsMap[keystr].isDisabled && widgetsMap[keystr].isVisible) {
				if(defaultEntities[keystr].color!=Configs.requiredColorAlert){
					defaultEntities[keystr].color = Configs.requiredColorAlert;
				}
				alert.push(keystr);
			} else {
				if(defaultEntities[keystr].color!=Configs.requiredColorPass){
					defaultEntities[keystr].color = Configs.requiredColorPass;
				}
			}

		}))
		console.log(alert)
		return alert;
	},
	setAttributes:async (DefaultEntity,defaultData,attributeType)=>{
		if(!attributeType) attributeType="data";
		await Promise.all( Object.keys(DefaultEntity).map(async(key)=>{
			let keystr= key.toString();
			if(defaultData[keystr] !== undefined && DefaultEntity[keystr][attributeType] !== undefined && defaultData[keystr] !== null){	
				DefaultEntity[keystr][attributeType] = defaultData[keystr];
			}}))
	},
	//InitializationDataList = [{ENTITY:Appsmith JS Object, DATA: {propName:any}}]
	initDefault:async(InitializationDataList)=>{
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
												 this.setAttributes(InitializationData.ENTITY,required,"required")
												]);
		}));

	},
	fieldValidate:{},
	initDefaultV2:async(InitializationDataList)=>{
		//run all default data query before calling
		//load validation
		if(!SELECT_FIELDS_VALIDATION || !Configs.pageName)return showAlert("SELECT_FIELDS_VALIDATION or Configs.pageName not found.","error");
		//if(SELECT_FIELDS_VALIDATION.data == undefined)
		await SELECT_FIELDS_VALIDATION.run();
		if(SELECT_FIELDS_VALIDATION.data && SELECT_FIELDS_VALIDATION.data?.length > 0){
			this.fieldValidate = JSON.parse("{"+_.join(SELECT_FIELDS_VALIDATION.data,",")+"}");
		}
		await Promise.all(InitializationDataList.map(async (InitializationData)=>{
			if(!InitializationData.DATA || !InitializationData.ENTITY) return console.error("Invalid InitializationData.");
			await Promise.all( Object.keys(InitializationData.ENTITY).map(async(key)=>{
				let keystr= key.toString();
				if(InitializationData.ENTITY[keystr]?.defaultData !== undefined){
					if(InitializationData.DATA?.[keystr] !== null && InitializationData.DATA?.[keystr] !== undefined)
						InitializationData.ENTITY[keystr].data = InitializationData.DATA[keystr];
					else
						InitializationData.ENTITY[keystr].data = InitializationData.ENTITY[keystr].defaultData;
				}
				if(InitializationData.ENTITY[keystr].color !== undefined) InitializationData.ENTITY[keystr].color = "";
			}))
		}));

	}

}