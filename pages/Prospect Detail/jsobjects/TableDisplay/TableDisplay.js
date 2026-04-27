export default {
	PROSPECTS_ACTIONLOGS:{
		//ColumnsMap:{"SQL Column":"Display Column"
		ColumnsMap:{
			"COMPANY_NAME_TH":"Detail",
			"USER_NAME":"Approval By",
			"PROSPECTS_STATUS":"Status",
			"CREATE_DATE":"Create Date",
			"UPDATE_DATE":"Update Date"
		},
		DateColumns:["CREATE_DATE","UPDATE_DATE"],
		data:[],
		run:async()=> await SELECT_FOR_LOG.run()
	}
}