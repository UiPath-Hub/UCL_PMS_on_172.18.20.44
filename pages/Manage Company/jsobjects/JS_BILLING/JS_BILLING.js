export default {
	initDefault:async ()=>{
		if(Configs.isTempPage()){
			//temp and load editing before manage contacts
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA:appsmith.store[Configs.newCompanyTempFlag]},{ENTITY:Current_Remark,DATA:{}},{ENTITY:Default_Remark,DATA:{}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);
		}else	if(appsmith.URL.queryParams[ Configs.editCompanyFlag] !== undefined){
			//LM
			await SELECT_BILLING.run()
			console.log("SELECT_BILLING")
			let data = SELECT_BILLING.data[0];
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA: data?data:{}},{ENTITY:Current_Remark,DATA:{}},{ENTITY:Default_Remark,DATA:{}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);

		}else{
			//New
			console.log("new billing")
			let InitializationEntityList = [{ENTITY:Default_COMPANY_BILLING,DATA:{}},{ENTITY:Current_Remark,DATA:{}},{ENTITY:Default_Remark,DATA:{}}];
			await GlobalFunctions.initDefaultV2(InitializationEntityList);
			_12_DELETE_REMARK_TEMP.run();
		}
		if(appsmith.mode=="EDIT" && Configs.RemarksOfInvoices.data?.length === 0)
			Configs.RemarksOfInvoices.data = Configs.RemarksOfInvoices.setDefault(Configs.RemarksOfInvoices.column);
	},
	ConfirmMethod:{NEW:"NEW",EDIT:"EDIT"},
	editRemarkKey : "editRemarkKey",
	onConfirmRemarkClick:async({confirm,method,editingRow})=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;

		if(appsmith.mode === "EDIT") console.log("confirm:"+confirm+" method:"+method);
		if(!confirm){
			//show Modal
			await GlobalFunctions.OnResetObject(Current_Remark,Default_Remark);
			if(method === this.ConfirmMethod.NEW){
				removeValue(this.editRemarkKey);
			}
			if(method === this.ConfirmMethod.EDIT){
				storeValue(this.editRemarkKey,editingRow);
				await _15_SELECT_REMARK_BY_ID.run({BILLING_REMARK_ID:editingRow.BILLING_REMARK_ID,IS_TEMP:Configs.isNewCompany()?1:0});
				let data = _15_SELECT_REMARK_BY_ID.data[0];
				if(data){
					await GlobalFunctions.setAttributes(Current_Remark,data,"data")
				}
			}
			await resetWidget(MODAL_REMARK_DETAIL.name,true);
			showModal(MODAL_REMARK_DETAIL.name);
		}else{
			//save
			let alertWidget = await GlobalFunctions.manualValidateV2(Current_Remark,Widgets_Remark);
			if(alertWidget.length > 0){
				const unique_Array = Array.from(new Set(alertWidget.map(i=>(i.label ||  _.toLower( i.widgetName).replaceAll("_"," ")))));
				let text = `Information is required or invalid. :: ${ unique_Array.join(',')}`
				showAlert(text);
				return;
			}
			const close = async ()=>{
				await Promise.all([this.loadRemarks(),closeModal(MODAL_REMARK_DETAIL.name),showAlert( "Save success","success")]);
			}
			if(appsmith.store[this.editRemarkKey] === undefined){
				//new
				await _13_INSERT_REMARK.run({
					BILLING_REMARK_TYPE:Configs.BILLING_REMARK_TYPE.invoice,
					INVOICE_REMARK_TYPE:Widgets_Remark.INVOICE_REMARK_TYPE.data,
					BILLING_REMARK_PRODUCT_TYPE_ID:Widgets_Remark.BILLING_REMARK_PRODUCT_TYPE_ID.data,
					BILLING_REMARK_PRODUCT_TYPE_NAME:Widgets_Remark.BILLING_REMARK_PRODUCT_TYPE_NAME.data,
					BILLING_REMARK_GROUP_ID:Widgets_Remark.BILLING_REMARK_GROUP_ID.data,
					BILLING_REMARK_DETAIL:Widgets_Remark.BILLING_REMARK_DETAIL.data});
				if(_13_INSERT_REMARK.data != undefined && _13_INSERT_REMARK.data.length === 1){
					if(_13_INSERT_REMARK.data[0]["RESULT_CODE"] === "DONE"){
						await close();
					}else{
						showAlert("Save failed: "+_13_INSERT_REMARK.data[0]["RESULT_MESSAGES"],"error");
					}
				}else showAlert( "Unknown result code","error");
			}else{
				//edit
				await _14_UPDATE_REMARK.run({
					BILLING_REMARK_ID:appsmith.store[this.editRemarkKey].BILLING_REMARK_ID,
					BILLING_REMARK_TYPE:Configs.BILLING_REMARK_TYPE.invoice,
					INVOICE_REMARK_TYPE:Widgets_Remark.INVOICE_REMARK_TYPE.data,
					BILLING_REMARK_PRODUCT_TYPE_ID:Widgets_Remark.BILLING_REMARK_PRODUCT_TYPE_ID.data,
					BILLING_REMARK_PRODUCT_TYPE_NAME:Widgets_Remark.BILLING_REMARK_PRODUCT_TYPE_NAME.data,
					BILLING_REMARK_GROUP_ID:Widgets_Remark.BILLING_REMARK_GROUP_ID.data,
					BILLING_REMARK_DETAIL:Widgets_Remark.BILLING_REMARK_DETAIL.data});
				if(_14_UPDATE_REMARK.data != undefined && _14_UPDATE_REMARK.data.length === 1){
					if(_14_UPDATE_REMARK.data[0]["RESULT_CODE"] === "DONE"){
						await close();
					}else{
						showAlert("Save failed: "+_14_UPDATE_REMARK.data[0]["RESULT_MESSAGES"],"error");
					}
				}else showAlert( "Unknown result code","error");
			}
		}
	},
	onDeleteRemark:async ()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		const close = async ()=>{
			await Promise.all([this.loadRemarks(),closeModal(MODAL_REMARK_DETAIL.name),showAlert( "Delete success","success")]);
		}
		await _16_DELETE_REMARK.run({BILLING_REMARK_ID:appsmith.store[this.editRemarkKey].BILLING_REMARK_ID});
		if(_16_DELETE_REMARK.data != undefined && _16_DELETE_REMARK.data.length === 1){
			if(_16_DELETE_REMARK.data[0]["RESULT_CODE"] === "DONE"){
				await close();
			}else{
				showAlert("Delete failed: "+_16_DELETE_REMARK.data[0]["RESULT_MESSAGES"],"error");
			}
		}else showAlert( "Unknown result code","error");
	},
	loadRemarks:async ()=>{
		if(Configs.isNewCompany()){
			//load temp remark
			await _11_SELECT_ALL_INV_REMARKS_TEM.run({BILLING_REMARK_TYPE:Configs.BILLING_REMARK_TYPE.invoice});
			if(_11_SELECT_ALL_INV_REMARKS_TEM.data && _11_SELECT_ALL_INV_REMARKS_TEM.data.length > 0)
				Configs.RemarksOfInvoices.data = Configs.RemarksOfInvoices.filterData(_11_SELECT_ALL_INV_REMARKS_TEM.data,Configs.RemarksOfInvoices.column);
			else
				Configs.RemarksOfInvoices.data = [];
		}else{
			//load remark lm
			await _10_SELECT_ALL_INV_REMARKS.run({BILLING_REMARK_TYPE:Configs.BILLING_REMARK_TYPE.invoice});
			if(_10_SELECT_ALL_INV_REMARKS.data && _10_SELECT_ALL_INV_REMARKS.data.length > 0)
				Configs.RemarksOfInvoices.data = Configs.RemarksOfInvoices.filterData(_10_SELECT_ALL_INV_REMARKS.data,Configs.RemarksOfInvoices.column);
			else
				Configs.RemarksOfInvoices.data = [];
		}
	}
}