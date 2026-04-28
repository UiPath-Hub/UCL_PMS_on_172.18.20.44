export default {
	V:6,
	LastChanged:
	`V5 if(!SELECT_FIELDS_VALIDATION.data) before run in init()
	V6 manualValidate: change Widgets-Map structure => Widgets-Ref`,
	manualValidate:async (widgetsValue,widgetsRef)=>{
		let alert = [];
		await Promise.all( Object.keys(widgetsValue).map(async (key)=>{
			let keystr = key.toString();
			if(!widgetsRef[keystr]?.widget?.widgetName)return;

			let data = widgetsRef[keystr].widgetData||"";
			const log = {};
			log.key = keystr;
			log.valid = widgetsRef[keystr].widget.isValid;
			log.disable = widgetsRef[keystr].widget.isDisabled;
			log.visible = widgetsRef[keystr].widget.isVisible;
			log.data = data;
			//console.log(log); 
			//find widget of the field by get from widget name of widgetMap
			//let widgetName = widgetsRef[keystr].widget.widgetName;
			widgetsValue[keystr].data = data
			if (!widgetsRef[keystr].widget.isValid && !widgetsRef[keystr].widget.isDisabled && widgetsRef[keystr].widget.isVisible) {
				if(widgetsValue[keystr].color!=Configs.requiredColorAlert){
					widgetsValue[keystr].color = Configs.requiredColorAlert;
				}
				alert.push(widgetsRef[keystr]?.widget?.label || keystr);
			} else {
				if(widgetsValue[keystr].color!=Configs.requiredColorPass){
					widgetsValue[keystr].color = Configs.requiredColorPass;
				}
			}

		}))
		//console.log(alert)
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