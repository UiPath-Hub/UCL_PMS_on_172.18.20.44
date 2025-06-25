export default {
	//default prop
	DEFAULT_ENTITY: DefaultContact,	
	PROVINCE_PROP_NAME:"COMPANY_CONTACT_PROVINCE_TH",
	DISTRICT_PROP_NAME:"COMPANY_CONTACT_DISTRICT_TH",
	SUB_DISTRICT_PROP_NAME:"COMPANY_CONTACT_SDISTRICT_TH",
	//store
	PROVINCE:"PROVINCE",
	DISTRICT_STORE_NAME:"DISTRICT",
	SUB_DISTRICT_STORE_NAME:"SUBDISTRICT",
	//reconstruct the widget to handle a function calling of widget. 
	PROVINCE_WIDGET: {...PROVINCE_TH,setDisabled:async(value)=>{await PROVINCE_TH.setDisabled(value)}},
	DISTRICT_WIDGET:{...DISTRICT_TH,setDisabled:async(value)=>{await DISTRICT_TH.setDisabled(value)}},
	SUB_DISTRICT_WIDGET:{...SUB_DISTRICT_TH,setDisabled:async(value)=>{await SUB_DISTRICT_TH.setDisabled(value)}},
	POSTAL_CODE_WIDGET:POSTAL_CODE,

	fetchAddressByPostalCode:async function (postalCode,DefaultEntity,provinePropName,districtPropName,subDistrictPropName, districtStoreName, subDistrictStoreName) {
		if (!postalCode || postalCode.length !== 5) return;
		console.log("call")
		await SELECT_ADDRESS.run({ POSTAL_CODE: postalCode });
		let P = {}, D = {}, SD = {};
		let PROVINCE = [], DISTRICT = [], SUBDISTRICT = [];
		let INIT_DISTRICT = [{ key: "", value: "" }];
		let INIT_SUBDISTRICT = [{ key: "", value: "" }];
		await Promise.all(
			SELECT_ADDRESS.data.map(async (row) => {
				if (row.POSTAL_CODE !== postalCode) return;
				if (!P[row.PROVINCE]) {
					P[row.PROVINCE] = true;
					PROVINCE.push({ key: row.PROVINCE, value: row.PROVINCE });
				}
				if (!D[row.DISTRICT]) {
					D[row.DISTRICT] = true;
					DISTRICT.push({ key: row.DISTRICT, value: row.DISTRICT });
				}
				if (!SD[row.SUBDISTRICT]) {
					SD[row.SUBDISTRICT] = true;
					SUBDISTRICT.push({ key: row.SUBDISTRICT, value: row.SUBDISTRICT });
				}
			})
		);
		SELECT_ADDRESS.clear();
		let allDistrictOfProvince = [];
		let allSubDistrictOfDistrict = [];
		// ตั้งค่าค่าดีฟอลต์
		if (PROVINCE.length === 1) {
			DefaultEntity[provinePropName].data = PROVINCE[0].value;
			await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value, DISTINCT:"DISTRICT"});
			allDistrictOfProvince = await Promise.all(SELECT_ADDRESS.data.map(async(row)=>({ key: row.DISTRICT, value: row.DISTRICT })))
		}
		if (DISTRICT.length === 1) {
			DefaultEntity[districtPropName].data = DISTRICT[0].value;
			await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value,DISTRICT:DISTRICT[0].value , DISTINCT:"SUBDISTRICT"});
			allSubDistrictOfDistrict = await Promise.all(SELECT_ADDRESS.data.map(async(row)=>({ key: row.SUBDISTRICT, value: row.SUBDISTRICT })))
		}
		if (SUBDISTRICT.length === 1) {
			DefaultEntity[subDistrictPropName].data = SUBDISTRICT[0].value;
		}
		
		let finalDistrict = allDistrictOfProvince.length>0?allDistrictOfProvince:DISTRICT.length>0?DISTRICT:INIT_DISTRICT;
		let finalSubDistrict = allSubDistrictOfDistrict.length>0?allSubDistrictOfDistrict:SUBDISTRICT.length>0?SUBDISTRICT:INIT_SUBDISTRICT;
		await Promise.all([storeValue(districtStoreName, finalDistrict, false),storeValue(subDistrictStoreName, finalSubDistrict, false)]);
		return {finalDistrict,finalSubDistrict}
	},
	setDisabledAll:async (value)=>{
		await Promise.all([this.PROVINCE_WIDGET,this.DISTRICT_WIDGET,this.SUB_DISTRICT_WIDGET].map(async (widget)=>{if(widget.isDisabled!=value)await widget.setDisabled(value)}))
	},
	onChange_POSTAL_CODE: async () => {
		if (!this.POSTAL_CODE_WIDGET.text || this.POSTAL_CODE_WIDGET.text.length !== 5) {
			await this.setDisabledAll(false);
			return;
		}
		await this.setDisabledAll(true);
		await this.fetchAddressByPostalCode(
			this.POSTAL_CODE_WIDGET.text, 
			this.DEFAULT_ENTITY, 
			this.PROVINCE_PROP_NAME, 
			this.DISTRICT_PROP_NAME, 
			this.SUB_DISTRICT_PROP_NAME, 
			this.DISTRICT_STORE_NAME, 
			this.SUB_DISTRICT_STORE_NAME
		);

		await Promise.all([
			resetWidget(this.PROVINCE_WIDGET.widgetName),
			resetWidget(this.DISTRICT_WIDGET.widgetName),
			resetWidget(this.SUB_DISTRICT_WIDGET.widgetName),
		]);

		await this.setDisabledAll(false);
	},

	onSelectedProvice:async (selectedPROVINCE)=>{
		await SELECT_ADDRESS.run({PROVINCE:selectedPROVINCE})
		//console.log(SELECT_ADDRESS.data)
		let verify={};
		let array= []
		await Promise.all(SELECT_ADDRESS.data.map(async(row)=>{
			if(verify[row.DISTRICT]==undefined){
				verify[row.DISTRICT] = 1;
				if(row.PROVINCE==selectedPROVINCE)
					array.push({key:row.DISTRICT,value:row.DISTRICT})
			}
		}))
		storeValue(this.DISTRICT_STORE_NAME,array,false);
		SELECT_ADDRESS.clear()
	},
	onSelectedDistrict:async (selectedPROVINCE,selectedDISTRICT)=>{
		await SELECT_ADDRESS.run({DISTRICT:selectedDISTRICT,PROVINCE:selectedPROVINCE})
		this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data = selectedDISTRICT;
		let verify={};
		let array= []
		await Promise.all(SELECT_ADDRESS.data.map(async(row)=>{
			if(verify[row.SUBDISTRICT]==undefined){
				verify[row.SUBDISTRICT] = 1;
				if(row.PROVINCE==selectedPROVINCE && row.DISTRICT == selectedDISTRICT)
					array.push({key:row.SUBDISTRICT,value:row.SUBDISTRICT})
			}
		}))
		storeValue(this.SUB_DISTRICT_STORE_NAME,array,false);
		SELECT_ADDRESS.clear()
	},
	fetchAndStoreAddress: async (province, district)=> {
		if (!province || !district) return { districts: [], subdistricts: [] };

		await SELECT_ADDRESS.run({ PROVINCE: province});

		let districtMap = {};
		let subdistrictMap = {};
		let districts = [];
		let subdistricts = [];

		await Promise.all(
			SELECT_ADDRESS.data.map(async (row) => {
				if (!districtMap[row.DISTRICT]) {
					districtMap[row.DISTRICT] = true;
					districts.push({ key: row.DISTRICT, value: row.DISTRICT });
				}
				if (!subdistrictMap[row.SUBDISTRICT]) {
					subdistrictMap[row.SUBDISTRICT] = true;
					subdistricts.push({ key: row.SUBDISTRICT, value: row.SUBDISTRICT });
				}
			})
		);

		return { districts, subdistricts };
	},
	initAddress:async ()=>{
		//let PROVINCE = [{key:"",value:""}];
		let INIT_DISTRICT = [{ key: "", value: "" }];
		let INIT_SUBDISTRICT = [{ key: "", value: "" }];

		if(SELECT_PROVINCEs.data == undefined && !SELECT_PROVINCEs.isLoading)
		await SELECT_PROVINCEs.run();
		console.log("SELECT_PROVINCEs");

		const initCompanyAddress = async ()=>{
			let { districts, subdistricts } = await this.fetchAndStoreAddress(
				this.DEFAULT_ENTITY[this.PROVINCE_PROP_NAME].data,
				this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data
			);
			storeValue(this.DISTRICT_STORE_NAME, districts.length ? districts : INIT_DISTRICT);
			storeValue(this.SUB_DISTRICT_STORE_NAME, subdistricts.length ? subdistricts : INIT_SUBDISTRICT);			
		}

		await Promise.all([initCompanyAddress()])
		console.log("initAddress");

		SELECT_ADDRESS.clear();
	},
}