export default {
	PMS_PROSPECTS_LM:{
		ColumnsMap:{
			"PROSPECTS_ID":"Prospective Number",
			"COMPANY_NAME": "Company Name",
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