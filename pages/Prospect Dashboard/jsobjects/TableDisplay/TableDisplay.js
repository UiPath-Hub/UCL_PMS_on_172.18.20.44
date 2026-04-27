export default {
	PMS_PROSPECTS_LM:{
		ColumnsMap:{
			"PROSPECTS_ID":"ID",
			"COMPANY_NAME_TH": "Company Name",
			"SHOP_NAME": "Shop Name",
			"PROSPECTS_STATUS": "Status",
			"CREATE_DATE": "Prospect Date",
			"CONTACT_PERSON": "Contact Person",
			"TELEPHONE": "Telephone"
		},
		DataColumns:["CREATE_DATE"],
		data:[],
		run:async()=> await SELECT_FOR_PROSPECTS.run()
	}
}