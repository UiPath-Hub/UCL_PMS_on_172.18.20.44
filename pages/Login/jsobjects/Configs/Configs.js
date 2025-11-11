export default {
	userSession:"userSession",
	ERPSyncConfig:{
		masterName:"RPA_SYNC_STATUS",
		syncAlert:{unhealthy:"Save success, but the ERP-Sync Service is not available. Data will be on pending status until the service is available.",apiError:"Save success, but the ERP-Sync Service processing is problematic, and data synchronization with UiPath Orchestrator may have errors."},
		syncErrorEscape:appsmith.currentPageName,
		syncStatusIconMap:{
			"Pending Add":{status:"Pending Add",icon:"time",color:"#eab308"},
			"Pending Edit":{status:"Pending Edit",icon:"time",color:"#eab308"},
			"Pending Delete":{status:"Pending Delete",icon:"time",color:"#eab308"},
			"Not_Synced":{status:"Not Synced",icon:"outdated",color:"#ef4444"},
			"Synced":{status:"Synced",icon:"tick",color:"green"}
		},
		constantKeys:{
			portal_sync:"Sync",
			portal_healthCheck:"health",
			parameter_companyID:"company_id",
			parameter_companyContacID:"contact_id",
			parameter_status:"status",
			parameter_tableName:"table_name",
			healthCheck_returnOKstatus:"ok",
			healthCheck_checkReturnName:"status",
			statusCheck_returnOKstatus:'successful',
			statusCheck_returnFailedStatus:'failed',
			statusCheck_checkReturnName:"status",
			sync_checkReturnName:"success",
			sync_returnOKstatus:true,
			sync_checkReturnName_ID: "id",
			healthCheck_returnCompanyIDName:"COMPANY_ID",
			healthCheck_returnContactIDName:"CONTACT_ID",
			portal_status:"status"
		}
	}

}