export default {
	PMS_INQUIRY_HEADER_LM:{
		ColumnsMap:{
			"INQUIRY_ID":"Inquiry Number",
			"CUSTOMER_NAME_TH": "Company Name",
			"PROGRESS": "Inquiry Progress",
			"CREATE_DATE": "Create Date"
		},
		DataColumns:["CREATE_DATE"],
		data:[],
		run:async()=> await SELECT_FOR_RESULT.run()
	}
}