export default {
	loadTable:async(tableName)=>{
		let data = await TableDisplay[tableName].run();
		if(data[0].TOTAL_RECORDS > 0){
			TableDisplay[tableName].data = await Promise.all(data.map(async(row)=>{
				//select row with specific key which contain in column map
				const displayRow = _.pick(row, Object.keys(TableDisplay[tableName].ColumnsMap));
				TableDisplay[tableName].DateColumns.forEach((DateColumnName)=>{
					if(displayRow[DateColumnName] !== undefined && displayRow[DateColumnName] !== null){
						displayRow[DateColumnName] = moment(displayRow[DateColumnName]).format(Configs.tableDataFormat);
					}
				})
				return _.mapKeys(displayRow, (value, key) => {
					return TableDisplay[tableName].ColumnsMap[key]
				})
			}))
			console.log("data",TableDisplay[tableName].data);
			return true;
		}else return false;
	},
	onEditItemClick:()=>{
		if(!Init.permissionsCheck(Configs.permissions.VIEW,false))return;
		if(!Init.permissionsCheck(Configs.permissions.EDIT,false))return;
		navigateTo('Prospect Dashboard', {}, 'SAME_WINDOW');
	},
	onClick_Close:async()=>{
		if(appsmith.store[Init.SINGLE_PAGE]?.recentPage && _.last(appsmith.store[Init.SINGLE_PAGE]?.recentPage)===Configs.pageName)
		{
			const backTo = appsmith.store[Init.SINGLE_PAGE].recentPage[appsmith.store[Init.SINGLE_PAGE].recentPage.length-2]
			await storeValue(Init.SINGLE_PAGE,{recentPage:_.slice(appsmith.store[Init.SINGLE_PAGE].recentPage,0,appsmith.store[Init.SINGLE_PAGE].recentPage.length-2)},false);
			navigateTo(backTo, {}, 'SAME_WINDOW');
		}else{
			navigateTo('Prospect Dashboard', {}, 'SAME_WINDOW');
		}
	}
	,onSaveClick:async(confirm)=>{
		if(!Init.permissionsCheck(Configs.permissions.EDIT,false))return;
		if(!confirm){
			let alertWidget = await GlobalFunctions.manualValidate(Widgets_Value.PMS_PROSPECTS_LM,Widgets_Ref.PMS_PROSPECTS_LM);
			if(alertWidget.length > 0){
				showAlert(`Some field is required or invalid. \n:${_.join(alertWidget,", ")}`)
			}else{
				showModal(MODAL_SAVE.name);
			}
		}else{
			await UPDATE_PROSPECT.run();
			if(UPDATE_PROSPECT.data != undefined && UPDATE_PROSPECT.data.length === 1){
				const close=async ()=>{
					await closeModal(MODAL_SAVE.name);
					if(appsmith.mode === "EDIT"){
						showAlert("Edit mode: Navigate to dashboard...");
					}else
						this.onClick_Close();
				}
				if(UPDATE_PROSPECT.data[0]["RESULT_CODE"] === "DONE"){
					showAlert("Save success","success");
					close();
				}else{
					showAlert( "Save failed."+UPDATE_PROSPECT.data[0]["RESULT_MESSAGES"],"error");

				}
			}else showAlert( "Unknown result code","error");
		}

	},onDeleteClick:async(confirm)=>{
		if(!Init.permissionsCheck(Configs.permissions.EDIT,false))return;
		if(!confirm){
			//showModal(MODAL_SAVE.name);
		}else{
			await DELETE_PROSPECT.run();
			if(DELETE_PROSPECT.data != undefined && DELETE_PROSPECT.data.length === 1){
				const close=async ()=>{
					//await closeModal(MODAL_SAVE.name);
					if(appsmith.mode === "EDIT"){
						showAlert("Edit mode: Navigate to dashboard...");
					}else
						this.onClick_Close();
				}
				if(DELETE_PROSPECT.data[0]["RESULT_CODE"] === "DONE"){
					showAlert("Delete success","success");
					close();
				}else{
					showAlert( "Delete failed."+DELETE_PROSPECT.data[0]["RESULT_MESSAGES"],"error");

				}
			}else showAlert( "Unknown result code","error");
		}

	},
	NextConfirm:"NextConfirm",
	onUpdateStatus: async (status,confirm)=>{
		if(!Init.permissionsCheck(Configs.permissions.EDIT,false))return;
		if(status){
			let closeModalName = "";
			let queryData;
			if(status=== "Qualify"){
				if(confirm){
					queryData=await UPDATE_STATUS.run({STATUS:"Qualify"});
					closeModalName =MODAL_QUALIFY_CONFIRM.name;					
				}else{
					showModal(MODAL_QUALIFY_CONFIRM.name);
					return;
				}

			}else if(status==="Disqualify"){
				if(confirm){
					queryData=await UPDATE_STATUS.run({STATUS:"Disqualify",IS_REJECT:1});
					closeModalName =MODAL_REASON_REJECT.name;
				}else{
					showModal(MODAL_REASON_REJECT.name);
					storeValue(Init.SINGLE_PAGE,{...appsmith.store?.[Init.SINGLE_PAGE],[this.NextConfirm]:"Disqualify"},false);
					return;
				}

			}else if(status==="Reject"){
				if(confirm){
					queryData=await UPDATE_STATUS.run({STATUS:"Reject",IS_REJECT:1});
					closeModalName =MODAL_REASON_REJECT.name;
				}else{
					showModal(MODAL_REASON_REJECT.name);
					storeValue(Init.SINGLE_PAGE,{...appsmith.store?.[Init.SINGLE_PAGE],[this.NextConfirm]:"Reject"},false);
					return;
				}

			}else if(status==="Approved"){
				if(confirm){
					queryData=await UPDATE_STATUS.run({STATUS:"Approved"});
					closeModalName =MODAL_APPROVE_CONFIRM.name;
				}else{
					showModal(MODAL_APPROVE_CONFIRM.name);
					return;
				}

			}else{
				return "Unknown status";
			}
			if(queryData != undefined && queryData.length === 1){
				const close=async ()=>{
					if(closeModalName)
						await closeModal(closeModalName);
					if(appsmith.mode === "EDIT"){
						showAlert("Edit mode: Navigate to dashboard...");
					}else
						this.onClick_Close();
				}
				if(queryData[0]["RESULT_CODE"] === "DONE"){
					showAlert("Update status success","success");
					close();
				}else{
					showAlert( "Update status failed."+UPDATE_PROSPECT.data[0]["RESULT_MESSAGES"],"error");

				}
			}
		}
	},
	DEV_changeState:()=>{
		const copy = (SER_SEARCH_FOR_PROSPECTS?.data?.[0].TOTAL_RECORDS ?? 0) === 0 ? 
					`INSERT INTO [dbo].[PMS_PROSPECTS_STATE](PROSPECTS_ID,UI_STATE,EDITABLE) VALUES (${PROSPECTS_ID.text},${UI_STATE.value},${EDITABLE.isChecked ? 1 : 0});`
		:`UPDATE [dbo].[PMS_PROSPECTS_STATE] SET UI_STATE = ${UI_STATE.value}, EDITABLE = ${EDITABLE.isChecked ? 1 : 0} WHERE PROSPECTS_ID = ${PROSPECTS_ID.text}`;
		copyToClipboard(copy);
		showAlert("Copy to clipboard");
	}
}