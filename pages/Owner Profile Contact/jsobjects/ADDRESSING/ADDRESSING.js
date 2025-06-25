export default {
	//default prop
	DEFAULT_ENTITY: Default_OwnerProfileContact,
	setEntityValue:(key,value)=>{
		//console.log(Default_OwnerProfileContact[key]);
		if(Default_OwnerProfileContact[key].data!== undefined){
			console.log(`set ${key} to ${value}`)
			Default_OwnerProfileContact[key].data = value;
		}
		
		return;
	},
	PROVINCE_PROP_NAME:"OWNER_CONTACT_PROVINCE_TH",
	DISTRICT_PROP_NAME:"OWNER_CONTACT_DISTRICT_TH",
	SUB_DISTRICT_PROP_NAME:"OWNER_CONTACT_SUB_DISTRICT_TH",
	//store
	DISTRICT_STORE_NAME:[{key:"",value:""}],
	SUB_DISTRICT_STORE_NAME:[{key:"",value:""}],
	//reconstruct the widget to handle a function calling of widget. 
	PROVINCE_WIDGET: {...OWNER_CONTACT_PROVINCE_TH,setDisabled:async(value)=>{await OWNER_CONTACT_PROVINCE_TH.setDisabled(value)}},
	DISTRICT_WIDGET:{...OWNER_CONTACT_DISTRICT_TH,setDisabled:async(value)=>{await OWNER_CONTACT_DISTRICT_TH.setDisabled(value)}},
	SUB_DISTRICT_WIDGET:{...OWNER_CONTACT_SUB_DISTRICT_TH,setDisabled:async(value)=>{await OWNER_CONTACT_SUB_DISTRICT_TH.setDisabled(value)}},
	POSTAL_CODE_WIDGET:OWNER_CONTACT_POSTAL_CODE,

	fetchAddressByPostalCode:async function (postalCode) {
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
		await SELECT_ADDRESS.clear();
		let allDistrictOfProvince = [];
		let allSubDistrictOfDistrict = [];
		// ตั้งค่าค่าดีฟอลต์
		if (PROVINCE.length === 1) {
			this.setEntityValue(this.PROVINCE_PROP_NAME,PROVINCE[0].value);
			console.log(Default_OwnerProfileContact[this.PROVINCE_PROP_NAME]);
			await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value, DISTINCT:"DISTRICT"});
			allDistrictOfProvince = await Promise.all(SELECT_ADDRESS.data.map(async(row)=>({ key: row.DISTRICT, value: row.DISTRICT })))
		}
		if (DISTRICT.length === 1) {
			this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data = DISTRICT[0].value;
			await SELECT_ADDRESS.run({ PROVINCE: PROVINCE[0].value,DISTRICT:DISTRICT[0].value , DISTINCT:"SUBDISTRICT"});
			allSubDistrictOfDistrict = await Promise.all(SELECT_ADDRESS.data.map(async(row)=>({ key: row.SUBDISTRICT, value: row.SUBDISTRICT })))
		}
		if (SUBDISTRICT.length === 1) {
			this.DEFAULT_ENTITY[this.SUB_DISTRICT_PROP_NAME].data = SUBDISTRICT[0].value;
		}

		let finalDistrict = allDistrictOfProvince.length>0?allDistrictOfProvince:DISTRICT.length>0?DISTRICT:INIT_DISTRICT;
		let finalSubDistrict = allSubDistrictOfDistrict.length>0?allSubDistrictOfDistrict:SUBDISTRICT.length>0?SUBDISTRICT:INIT_SUBDISTRICT;
		this.DISTRICT_STORE_NAME = finalDistrict;
		this.SUB_DISTRICT_STORE_NAME = finalSubDistrict;
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
			this.POSTAL_CODE_WIDGET.text
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
		this.DISTRICT_STORE_NAME =array;
		SELECT_ADDRESS.clear()
	},
	onSelectedDistrict:async (selectedPROVINCE,selectedDISTRICT)=>{
		await SELECT_ADDRESS.run({DISTRICT:selectedDISTRICT,PROVINCE:selectedPROVINCE})
		let verify={};
		let array= []
		await Promise.all(SELECT_ADDRESS.data.map(async(row)=>{
			if(verify[row.SUBDISTRICT]==undefined){
				verify[row.SUBDISTRICT] = 1;
				if(row.PROVINCE==selectedPROVINCE && row.DISTRICT == selectedDISTRICT)
					array.push({key:row.SUBDISTRICT,value:row.SUBDISTRICT})
			}
		}))
		this.SUB_DISTRICT_STORE_NAME = array;
		this.DEFAULT_ENTITY[this.DISTRICT_PROP_NAME].data = selectedDISTRICT;		
		//SELECT_ADDRESS.clear()
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
			this.DISTRICT_STORE_NAME =  districts.length ? districts : INIT_DISTRICT;
			this.SUB_DISTRICT_STORE_NAME = subdistricts.length ? subdistricts : INIT_SUBDISTRICT;	
		}

		await Promise.all([initCompanyAddress()])
		console.log("initAddress");

		SELECT_ADDRESS.clear();
	},
}