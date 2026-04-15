export default {
	PROSPECTS_ACTIONLOGS:{
		ColumnsMap:{
			"Detail":"Detail",
			"Approval By": "Approval By",
			"PROSPECTS_STATUS": "Status",
			"CREATE_DATE": "Create Date",
			"Update Date": "Update Date"
		},
		DateColumns:["CREATE_DATE"],
		data:[],
		run:async()=> await SELECT_FOR_PROSPECTS.run()
	}
}