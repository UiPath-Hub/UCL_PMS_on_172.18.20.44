export default {
	DisableWidget:false,
	LanguageControl:"TH",
	Language_PROP_NAME:"this.LanguageControl",
	Language_WIDGET:()=>({...ADDRESS_LANGUAGE,data:ADDRESS_LANGUAGE.selectedOptionValue}),
	//default prop
	DEFAULT_ENTITY: Widgets_Value.PMS_PROSPECTS_LM,
	SET_ENTITY_VALUE:async (prop,value) => {
		//normal object
		//this.DEFAULT_ENTITY[prop].data = value;
		this.CACHE_VALUE[prop] = value;
	},
	PROVINCE_PROP_NAME:"PROVINCE_TH",
	DISTRICT_PROP_NAME:"DISTRICT_TH",
	SUB_DISTRICT_PROP_NAME:"SUB_DISTRICT_TH",
	POSTAL_CODE_PROP_NAME:"POSTAL_CODE",
	//store
	DISTRICT_STORE:[{
		"ID":0,
		"DISTRICT_TH":"",
		"DISTRICT_EN":""
	}],
	SUB_DISTRICT_STORE:[
		{
			"SUBDISTRICT_TH": "",
			"SUBDISTRICT_EN": "",
			"ID": 0
		}
	],
	//reconstruct the widget to handle a function calling of widget. 
	PROVINCE_WIDGET: ()=>({...PROVINCE_TH}),
	DISTRICT_WIDGET: ()=>({...DISTRICT_TH}),
	SUB_DISTRICT_WIDGET: ()=> ({...SUB_DISTRICT_TH}),
	POSTAL_CODE_WIDGET: ()=> ({...POSTAL_CODE}),
	init_DefaultValue:()=>{
		this.SET_ENTITY_VALUE("PROVINCE",Widgets_Value.PMS_PROSPECTS_LM?.[this.PROVINCE_PROP_NAME]?.data ?? "");
		this.SET_ENTITY_VALUE("DISTRICT",Widgets_Value.PMS_PROSPECTS_LM?.[this.DISTRICT_PROP_NAME]?.data ?? "");
		this.SET_ENTITY_VALUE("SUB_DISTRICT",Widgets_Value.PMS_PROSPECTS_LM?.[this.SUB_DISTRICT_PROP_NAME]?.data ?? "");
		this.SET_ENTITY_VALUE("POSTAL_CODE",Widgets_Value.PMS_PROSPECTS_LM?.[this.POSTAL_CODE_PROP_NAME]?.data ?? "");

	},
	CACHE_VALUE:{
		PROVINCE:"",
		DISTRICT:"",
		SUB_DISTRICT:"",
		POSTAL_CODE:""
	},

	fetchAddressByPostalCode:async function (postalCode) {
		if (!postalCode || postalCode.length !== 5) return;
		//console.log("call")
		//await SELECT_ADDRESS.run({ POSTAL_CODE: postalCode });
		//let P = {}, D = {}, SD = {};
		//let PROVINCE = [], DISTRICT = [], SUBDISTRICT = [];
		let {
			districts,
			subdistricts,
			provinces
		} = await this.fetchAndStoreAddress({POSTAL_CODE:postalCode});

		let allDistrictOfProvince = [];
		let allSubDistrictOfDistrict = [];
		let all;
		// ตั้งค่าค่าดีฟอลต์
		let firstProvince = provinces[0]?.PROVINCE_TH
		let firstDistrict = districts[0]?.DISTRICT_TH
		let firstSubdistrict = subdistricts[0]?.SUBDISTRICT_TH
		if (provinces.length === 1) {
			//DefaultEntity[provinePropName].data =  firstProvince;
			await this.SET_ENTITY_VALUE("PROVINCE",firstProvince);
			all = await this.fetchAndStoreAddress({ PROVINCE: firstProvince , DISTINCT:"DISTRICT"});
			//await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value, DISTINCT:"DISTRICT"});
			allDistrictOfProvince = all.districts;
		}
		if (districts.length === 1) {
			//DefaultEntity[districtPropName].data = firstDistrict ;
			await this.SET_ENTITY_VALUE("DISTRICT",firstDistrict);
			all = await this.fetchAndStoreAddress({ PROVINCE:  firstProvince,DISTRICT:firstDistrict , DISTINCT:"SUBDISTRICT"})
			//await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value,DISTRICT:DISTRICT[0].value , DISTINCT:"SUBDISTRICT"});
			allSubDistrictOfDistrict = all.subdistricts;
		}
		if (subdistricts.length === 1) {
			//DefaultEntity[subDistrictPropName].data = firstSubdistrict;
			await this.SET_ENTITY_VALUE("SUB_DISTRICT",firstSubdistrict);
		}

		let finalDistrict = allDistrictOfProvince.length>0?allDistrictOfProvince:districts;
		let finalSubDistrict = allSubDistrictOfDistrict.length>0?allSubDistrictOfDistrict:subdistricts;
		this.DISTRICT_STORE = finalDistrict;
		this.SUB_DISTRICT_STORE = finalSubDistrict;
		return {finalDistrict,finalSubDistrict}
	},
	setDisabledAll:async (value)=>{
		this.DisableWidget = value;
	},
	onChange_POSTAL_CODE: async () => {
		if (!this.POSTAL_CODE_WIDGET().text || this.POSTAL_CODE_WIDGET().text.length !== 5) {
			await this.setDisabledAll(false);
			return;
		}
		await this.SET_ENTITY_VALUE("POSTAL_CODE",this.POSTAL_CODE_WIDGET().text);
		await this.setDisabledAll(true);
		await this.fetchAddressByPostalCode(
			this.POSTAL_CODE_WIDGET().text
		);

		await Promise.all([
			resetWidget(this.PROVINCE_WIDGET().widgetName),
			resetWidget(this.DISTRICT_WIDGET().widgetName),
			resetWidget(this.SUB_DISTRICT_WIDGET().widgetName),
		]);

		await this.setDisabledAll(false);
	},

	onSelectedProvice:async (selectedPROVINCE)=>{
		let all = await this.fetchAndStoreAddress({PROVINCE:selectedPROVINCE,DISTINCT:'DISTRICT'});
		await this.SET_ENTITY_VALUE("PROVINCE",selectedPROVINCE);
		this.DISTRICT_STORE = all.districts;
		//SELECT_ADDRESS.clear()
	},
	onSelectedDistrict:async (selectedPROVINCE,selectedDISTRICT)=>{
		//console.log("selectDistrict")
		//this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data = selectedDISTRICT;
		await this.SET_ENTITY_VALUE("DISTRICT",selectedDISTRICT);
		let all = await this.fetchAndStoreAddress({DISTRICT:selectedDISTRICT,PROVINCE:selectedPROVINCE,DISTINCT:'SUBDISTRICT'})
		this.SUB_DISTRICT_STORE = all.subdistricts;
		//SELECT_ADDRESS.clear()
	},
	fetchAndStoreAddress: async ({ PROVINCE, DISTRICT, POSTAL_CODE, DISTINCT }) => {
		let params = {};
		if (PROVINCE !== undefined) params = { ...params, PROVINCE };
		if (DISTRICT !== undefined) params = { ...params, DISTRICT };
		if (POSTAL_CODE !== undefined) params = { ...params, POSTAL_CODE };
		if (DISTINCT !== undefined) params = { ...params, DISTINCT };

		await SELECT_ADDRESS.run(params);

		let districtKey = { TH: "DISTRICT_TH", EN: "DISTRICT_EN" };
		let subdistrictKey = { TH: "SUBDISTRICT_TH", EN: "SUBDISTRICT_EN" };
		let provinceKey = { TH: "PROVINCE_TH", EN: "PROVINCE_EN" };

		let districtMap = {};
		let subdistrictMap = {};
		let provinceMap = {};
		let districts = [];
		let subdistricts = [];
		let provinces = [];

		// เตรียม Transactions ในรูปแบบ array ของ object ที่มี logic เดิม
		let transactions = [
			{
				KeyTH: districtKey.TH,
				KeyEN: districtKey.EN,
				ParentRaw:[],
				Map: districtMap,
				ArrayOutput: districts
			},
			{
				KeyTH: subdistrictKey.TH,
				KeyEN: subdistrictKey.EN,
				ParentRaw:[districtKey.TH],
				Map: subdistrictMap,
				ArrayOutput: subdistricts
			},
			{
				KeyTH: provinceKey.TH,
				KeyEN: provinceKey.EN,
				ParentRaw:[],
				Map: provinceMap,
				ArrayOutput: provinces
			}
		];

		await Promise.all(
			SELECT_ADDRESS.data.map(async (row) => {
				await Promise.all(
					transactions.map(async (tx) => {
						let keyValue = row[tx.KeyTH];
						if (keyValue && !tx.Map[keyValue]) {
							tx.Map[keyValue] = true;
							let temp = {
								ID: row.ID,
								[tx.KeyTH]: keyValue,
								[tx.KeyEN]: row[tx.KeyEN]
							}
							if(tx.ParentRaw && tx.ParentRaw.length>0)
								await Promise.all(tx.ParentRaw.map(async(parent)=>{if(row[parent]) temp[parent] = row[parent]}))
							tx.ArrayOutput.push(temp);
						}
					})
				);
			})
		);

		return {
			districts,
			subdistricts,
			provinces
		};
	},
	province_ConvertToID:(dataTH)=>{
		return SELECT_PROVINCEs.data.find((item)=>item.PROVINCE_TH==dataTH)?.ID ||""
	},
	district_ConvertToID:(dataTH)=>{
		return this.DISTRICT_STORE.find((item)=>item.DISTRICT_TH==dataTH)?.ID ||""
	},
	subdistrict_ConvertToID:(dataTH)=>{
		return this.SUB_DISTRICT_STORE.find((item)=>item.SUBDISTRICT_TH==dataTH)?.ID ||""
	},

	province_ConvertToTH:(ID)=>{
		return SELECT_PROVINCEs.data.find((item)=>item.ID==ID)?.PROVINCE_TH ||""
	},
	district_ConvertToTH:(ID)=>{
		return this.DISTRICT_STORE.find((item)=>item.ID==ID)?.DISTRICT_TH ||""
	},
	subdistrict_ConvertToTH:(ID)=>{
		return this.SUB_DISTRICT_STORE.find((item)=>item.ID==ID)?.SUBDISTRICT_TH ||""
	},

	province_ConvertToEN:(ID)=>{
		return SELECT_PROVINCEs.data.find((item)=>item.ID==ID)?.PROVINCE_EN ||""
	},
	district_ConvertToEN:(ID)=>{
		return this.DISTRICT_STORE.find((item)=>item.ID==ID)?.DISTRICT_EN ||""
	},
	subdistrict_ConvertToEN:(ID)=>{
		return this.SUB_DISTRICT_STORE.find((item)=>item.ID==ID)?.SUBDISTRICT_EN ||""
	},

	onChangedLanguage:async()=>{
		let provinceID= this.PROVINCE_WIDGET().selectedOptionValue
		let districtID = this.DISTRICT_WIDGET().selectedOptionValue
		let subdistrictID = this.SUB_DISTRICT_WIDGET().selectedOptionValue
		//showAlert(JSON.stringify([provinceID,districtID,subdistrictID]));
		await this.SET_ENTITY_VALUE("PROVINCE",await this.province_ConvertToTH (provinceID));
		await this.SET_ENTITY_VALUE("DISTRICT",await this.district_ConvertToTH (districtID));
		await this.SET_ENTITY_VALUE("SUB_DISTRICT",await this.subdistrict_ConvertToTH (subdistrictID));
		this.LanguageControl = this.Language_WIDGET().data;
		//showAlert(JSON.stringify([this.DEFAULT_ENTITY[this.PROVINCE_PROP_NAME].data ,this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data,this.DEFAULT_ENTITY[this.SUB_DISTRICT_PROP_NAME].data]))
	},
	initAddress:async ()=>{
		if(SELECT_PROVINCEs.data == undefined && !SELECT_PROVINCEs.isLoading)
			await SELECT_PROVINCEs.run();
		console.log("SELECT_PROVINCEs");

		let { districts, subdistricts,province} = await this.fetchAndStoreAddress(
			{PROVINCE:this.DEFAULT_ENTITY[this.PROVINCE_PROP_NAME].data});
		this.DISTRICT_STORE=districts;
		this.SUB_DISTRICT_STORE=subdistricts;
		if(this.DEFAULT_ENTITY[this.Language_PROP_NAME])
			this.LanguageControl = this.DEFAULT_ENTITY[this.Language_PROP_NAME].data||this.LanguageControl
		this.init_DefaultValue();
		console.log("initAddress");

		//SELECT_ADDRESS.clear();
	},
	test:async()=>{

	}
}