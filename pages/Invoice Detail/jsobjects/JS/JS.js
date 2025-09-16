export default {
	onBttn_ManageRevisedInvoice:async()=>{
		if(SELECT_INVOICE.data[0]?.DUPLICATED_ID){
			await storeValue("INIT",{INVOICE_ID:SELECT_INVOICE.data[0].DUPLICATED_ID},true);
			navigateTo(appsmith.URL.fullPath.replace(Configs.invoiceIDParameterName,"ReferInvoice"),{},"SAME_WINDOW");
		}
	},
	onBttn_Delete_Detail:async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		const selectedRows=Table_PMS_INVOICE_DETAIL_Edit.selectedRows;
		if(selectedRows.length==0)return;
		if (Array.isArray(selectedRows)){
			const undoqueue = selectedRows.map((i)=>({INVOICE_DETAIL_ID:i.INVOICE_DETAIL_ID,type:Configs.undo_stack.type.remove}));
			Configs.undo_stack.data.push(...undoqueue);
		}
	},
	onBttn_Undo_Detail:async()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		const lastActivity = Configs.undo_stack.data.pop();
		if(!lastActivity)return;
		if(lastActivity.type === Configs.undo_stack.type.remove){
			//no data change.
		}else if(lastActivity.type === Configs.undo_stack.type.edit){
			Configs.invoice_items = Configs.invoice_items.map((item)=>{
				if(item.INVOICE_DETAIL_ID === lastActivity.INVOICE_DETAIL_ID){
					return lastActivity.backup;
				}else{
					return item;
				}
			});
		}
	},
	onSubmitEditDetail:async ()=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		const id = Table_PMS_INVOICE_DETAIL_Edit.updatedRow.INVOICE_DETAIL_ID;
		const backup = Table_PMS_INVOICE_DETAIL_Edit.tableData.find(i=>i.INVOICE_DETAIL_ID===id);
		Configs.undo_stack.data.push({INVOICE_DETAIL_ID:id,type:Configs.undo_stack.type.edit,backup:backup});
		Configs.invoice_items = Configs.invoice_items.map((item)=>{
			if(item.INVOICE_DETAIL_ID === id){
				return Table_PMS_INVOICE_DETAIL_Edit.updatedRow;
			}else{
				return item;
			}
		});
	},
	onBttn_SELECT_COMPANY:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			let ID = tb_PMS_COMPANY_LM.selectedRow.COMPANY_ID;
			if(ID){
				await SELECT_COMPANY.run({ID});
				if(SELECT_COMPANY.data[0]){
					COMPANY_ID.setValue(SELECT_COMPANY.data[0].COMPANY_ID||"");
					COMPANY_NAME.setValue(SELECT_COMPANY.data[0].COMPANY_NAME||"");
					COMPANY_ADD_NO.setValue(SELECT_COMPANY.data[0].COMPANY_ADD_NO||"");
					COMPANY_ROAD.setValue(SELECT_COMPANY.data[0].COMPANY_ROAD||"");
					COMPANY_DISTRICT.setValue(SELECT_COMPANY.data[0].COMPANY_DISTRICT||"");
					COMPANY_POSTAL_CODE.setValue(SELECT_COMPANY.data[0].COMPANY_POSTAL_CODE||"");
					COMPANY_FLOOR.setValue(SELECT_COMPANY.data[0].COMPANY_FLOOR||"");
					COMPANY_MOO.setValue(SELECT_COMPANY.data[0].COMPANY_MOO||"");
					COMPANY_SOI.setValue(SELECT_COMPANY.data[0].COMPANY_SOI||"");
					COMPANY_SUB_DISTRICT.setValue(SELECT_COMPANY.data[0].COMPANY_SUB_DISTRICT||"");
					COMPANY_PROVINCE.setValue(SELECT_COMPANY.data[0].COMPANY_PROVINCE||"");
					TAX_ID.setValue(SELECT_COMPANY.data[0].TAX_ID||"");
					INVOICE_CONTACT_PERSON.setValue(SELECT_COMPANY.data[0].CONTACT_NAME||"");
					INVOICE_CONTACT_TELEPHONE.setValue(SELECT_COMPANY.data[0].COMPANY_CONTACT_TELEPHONE||"");
					INVOICE_CONTACT_EMAIL.setValue(SELECT_COMPANY.data[0].COMPANY_CONTACT_EMAIL||"");
					closeModal(Modal_SelectCompany.name);
				}
			}
		}else{
			await showModal(Modal_SelectCompany.name);
		}
	},
	onClick_BUTTON_SEARCH:async()=>{
		await SP_SER_SEARCH_FOR_COMPANY.run();
		resetWidget(tb_PMS_COMPANY_LM.widgetName);
	},
	onBttn_CANCEL_INVOICE:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			_3_CNInvoice.run().then(async() => {
				await closeModal(MODAL_CN.name);
				await showAlert("Cancel success.","success");
				//navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
				navigateTo(appsmith.URL.fullPath,{},"SAME_WINDOW");
				//Init.pageLoad();
			}).catch(() => {
				showAlert(_3_CNInvoice.data, 'error');
			});
		}else{
			await showModal(MODAL_CN.name);
		}
	},
	onBttn_DUPLICATE_INVOICE:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			_4_DraftInvoice.run().then(async() => {
				await closeModal(MODAL_DUPLICATE_CONFIRM.name);
				if(SELECT_INVOICE.data[0]?.INVOICE_NO){
					await closeModal(MODAL_DUPLICATE_CONFIRM.name);
					await removeValue("INIT");
					await storeValue("INIT",{INVOICE_ID:_4_DraftInvoice.data[0]?.INVOICE_ID},true);
					//console.log(appsmith.store.INIT);
					//navigateTo(appsmith.URL.fullPath, {[Configs.invoiceIDParameterName]:""}, 'SAME_WINDOW')
					navigateTo(appsmith.URL.fullPath.replace(Configs.invoiceIDParameterName,"ReferInvoice"),{},"SAME_WINDOW");
					//Init.pageLoad();
				}
			}).catch(() => {
				showAlert(_4_DraftInvoice.data, 'error');
			});
		}else{
			await showModal(MODAL_DUPLICATE_CONFIRM.name);
		}
	},
	onBttn_REJECT_CONFIRM:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			_2_RejectInvoice.run().then(async() => {
				await closeModal(MODAL_REJECT_CONFIRM.name);
				navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
			}).catch(() => {
				showAlert(_2_RejectInvoice.data, 'error');
			});
		}else{
			await showModal(MODAL_REJECT_CONFIRM.name);
		}
	},
	onBttn_APPROVE_INVOICE:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			_1_ApproveInvoice.run().then(async() => {
				await closeModal(MODAL_APPROVE_CONFIRM.name)
				navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
			}).catch(() => {
				showAlert(_1_ApproveInvoice.data, 'error');
			});
		}else{
			await showModal(MODAL_APPROVE_CONFIRM.name);
		}


	},
	onBttn_SAVE_DRAFT:async(confirm,final)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;

		if(confirm){
			let errorPoint = "";
			let hasError = false;

			//update detail
			const uniqueChanged_Detail_ID_Array = Array.from(new Set(Configs.undo_stack.data.map((i)=>i.INVOICE_DETAIL_ID)));
			const uniqueRemoved_Detail_ID_Array = Array.from(new Set(Configs.undo_stack.data.filter(i=>i.type===Configs.undo_stack.type.remove).map((edited)=>edited.INVOICE_DETAIL_ID)));
			for (const row of Configs.invoice_items.filter(item=>uniqueChanged_Detail_ID_Array.includes(item.INVOICE_DETAIL_ID))){
				if (row.INVOICE_DETAIL_ID){
					let params = {};
					if(uniqueRemoved_Detail_ID_Array.includes(row.INVOICE_DETAIL_ID)){
						params = {INVOICE_DETAIL_ID: row.INVOICE_DETAIL_ID,
											DELETE_FLAG_DETAIL:1,
											TOTAL_PRICE_DETAIL: row.TOTAL_PRICE,
											PRICE_PER_UNIT_DETAIL: row.PRICE_PER_UNIT,
											PRODUCT_DESCRIPTION_DETAIL: row.PRODUCT_DESCRIPTION,
											INVOICE_QUANTITY_DETAIL: row.INVOICE_QUANTITY,
											UOM : row.UOM
										 }
					}else{
						params = {
							TOTAL_PRICE_DETAIL: row.TOTAL_PRICE,
							PRICE_PER_UNIT_DETAIL: row.PRICE_PER_UNIT,
							PRODUCT_DESCRIPTION_DETAIL: row.PRODUCT_DESCRIPTION,
							INVOICE_QUANTITY_DETAIL: row.INVOICE_QUANTITY,
							INVOICE_DETAIL_ID: row.INVOICE_DETAIL_ID,
							UOM : row.UOM
						}
					}
					console.log(JSON.stringify(params));
					await _7_DraftInvoiceDetail.run(params);
					if (!_7_DraftInvoiceDetail.responseMeta.isExecutionSuccess) {
						hasError = true;
						errorPoint = 'Detail: '+JSON.stringify(params);
						break; // Exit the loop on the first error
					}
				}
			}
			Configs.undo_stack.data = [];
			//update header
			await _4_DraftInvoice.run();
			if(final===true){
				await _4_DraftInvoice.run({SF:true});
			}


			if(_4_DraftInvoice.responseMeta.isExecutionSuccess){
				if(final===true){
					await _5_SaveFinal.run();
					if(!_5_SaveFinal.responseMeta.isExecutionSuccess){
						hasError = true;
						errorPoint = 'SaveFinal';
					}
				}
			}else{
				hasError = true;
				errorPoint = 'Header';
			}

			if(!hasError){
				await showAlert("Save success.","success");

				if(final===true){
					await closeModal( MODAL_SAVEFINAL_CONFIRM.name);
					navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
				}
				else{
					await closeModal(MODAL_SAVEDRAFT_CONFIRM.name);
					navigateTo(appsmith.URL.fullPath,{},"SAME_WINDOW");
					//Init.pageLoad();
				}

			}else{
				showAlert("Save Failure; "+errorPoint,"error");
			}
		}else{
			if(final===true) await showModal( MODAL_SAVEFINAL_CONFIRM.name);
			else await showModal(MODAL_SAVEDRAFT_CONFIRM.name);
		}

	},
	onBttn_DisableSave:()=>{
		let is_draft = Configs.is_draft??false;
		return !is_draft
	},
	onDocReviewVisible:()=>{
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?(SELECT_INVOICE.data[0].FILE_DRAFT??SELECT_INVOICE.data[0].FILE_ORIGINAL)!=null:false
	},
	onBttn_ChangeStatus_ApproveDisable:()=>{
		let disableStatus = ["Draft Invoice","Approved","Waiting for Payment","Over Due","Canceled","Payment Completed","Rejected"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_RejectDisable:()=>{
		let disableStatus = ["Draft Invoice","Approved","Rejected","Canceled","Waiting for Payment"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_CanceledDisable:()=>{
		let disableStatus = ["Draft Invoice","Canceled"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_DuplicateInvoiceEnable:()=>{
		let enableStatus = ["Canceled"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?enableStatus.includes(SELECT_INVOICE.data[0].STATUS):false
	},
	onClick_Close:()=>{
		navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
	},
	onEditItemClick:async (confirm)=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			if(!confirm)
				showModal(Modal_ManageItem.name);
			else{

			}
		}
	},
	onConfirmEditItem: async(newDescription)=>{
		let editID = Table_PMS_INVOICE_DETAIL_LM.selectedRows.map(ele=>ele.INVOICE_DETAIL_ID);
		Configs.invoice_items = Configs.invoice_items.map(ele=>{
			if(editID.includes(ele.INVOICE_DETAIL_ID))
				return {...ele,PRODUCT_DESCRIPTION:newDescription}
			else return ele;
		})
		await resetWidget(Table_PMS_INVOICE_DETAIL_LM.widgetName,false);
		closeModal(Modal_ManageItem.name);
	},
	onDeleteButtonClick:async ()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			showModal(MODAL_DELETE.name);
		}
	},
	onDeleteConfirmClick:async()=>{
		if(await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			//await UPDATE_DELETE_INVOICE.run();
			//await closeModal(MODAL_DELETE.name);
			//navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
		}		
	},
	onDeleteItemClick:async()=>{
		let editID = Table_PMS_INVOICE_DETAIL_LM.selectedRows.map(ele=>ele.INVOICE_DETAIL_ID);
		if(editID.length != Configs.invoice_items.length)
			Configs.invoice_items = Configs.invoice_items.filter(ele=>editID.includes(ele.INVOICE_DETAIL_ID));
		else Configs.invoice_items = []
		await resetWidget(Table_PMS_INVOICE_DETAIL_LM.widgetName,false);
	},
	/*onAddNewItem:async ()=>{
		showModal(Modal_Add.name)
	},*/
	/*onAddNewItemConfirm:async ()=>{
		let i = 0;
		let ids=Configs.invoice_items.map((ele)=>ele.INVOICE_DETAIL_ID);
		if(ids.includes(SELECT_NEW_ITEM.selectedOptionValue)){
			showAlert("The item already exists.");
			return;
		}
		while(i< SELECT_INVOICE_ITEM.data.length){
			let ele= SELECT_INVOICE_ITEM.data[i];
			if(ele.INVOICE_DETAIL_ID==SELECT_NEW_ITEM.selectedOptionValue){
				//console.log(ele.DETAIL_REMARK);

				Configs.invoice_items.push(ele);
				break;
			}
			i++;
		}
		await resetWidget("Table_PMS_INVOICE_DETAIL_LM",false);		
		closeModal(Modal_Add.name)
	}*/
}