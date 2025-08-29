export default {
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
				navigateTo(appsmith.URL.fullPath,{},"SAME_WINDOWS");
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
					await storeValue("INIT",{INVOICE_ID:_4_DraftInvoice.data[0]?.INVOICE_ID});
					navigateTo(appsmith.URL.fullPath.replace(Configs.invoiceIDParameterName,"ReferInvoice"),{},"SAME_WINDOWS");
				}
			}).catch(() => {
				showAlert(_2_RejectInvoice.data, 'error');
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
	onBttn_SAVE_FINAL:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			await _5_SaveFinal.run();
			if(_4_DraftInvoice.responseMeta.isExecutionSuccess)
				await showAlert("Save success.","success");
			await closeModal(MODAL_SAVEDRAFT_CONFIRM.name);
			navigateTo('Invoice Dashboard',{},"SAME_WINDOWS");
		}else{
			await showModal(MODAL_SAVEDRAFT_CONFIRM.name);
		}

	},
	onBttn_SAVE_DRAFT:async(confirm)=>{
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,true)) return;
		if(confirm){
			await _4_DraftInvoice.run();
			if(_4_DraftInvoice.responseMeta.isExecutionSuccess)
				await showAlert("Save success.","success");
			await closeModal(MODAL_SAVEDRAFT_CONFIRM.name);
			navigateTo(appsmith.URL.fullPath.replace(Configs.invoiceIDParameterName,"ReferInvoice"),{},"SAME_WINDOWS");
		}else{
			await showModal(MODAL_SAVEDRAFT_CONFIRM.name);
		}

	},
	onBttn_DisableSave:()=>{
		let is_saveFinal = false;
		let is_draft = Configs.is_draft;

		if(_6_IS_SAVE_FINAL.data){
			is_saveFinal = true;
		}

		return is_saveFinal||!is_draft
	},
	onDocReviewVisible:()=>{
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?(SELECT_INVOICE.data[0].FILE_DRAFT??SELECT_INVOICE.data[0].FILE_ORIGINAL)!=null:false
	},
	onBttn_ChangeStatus_ApproveDisable:()=>{
		let disableStatus = ["Approved","Waiting for Payment","Over Due","Canceled","Payment Completed","Rejected"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_RejectDisable:()=>{
		let disableStatus = ["Approved","Rejected","Canceled","Waiting for Payment"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_CanceledDisable:()=>{
		let disableStatus = ["Canceled"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?disableStatus.includes(SELECT_INVOICE.data[0].STATUS):true
	},
	onBttn_ChangeStatus_DuplicateInvoiceEnable:()=>{
		let enableStatus = ["Canceled"];
		return SELECT_INVOICE.data && SELECT_INVOICE.data.length>0?enableStatus.includes(SELECT_INVOICE.data[0].STATUS):false
	},
	onClick_Close:()=>{
		navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
	},
	onEditItemClick:()=>{
		showModal(Modal_ManageItem.name);

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
			await UPDATE_DELETE_INVOICE.run();
			await closeModal(MODAL_DELETE.name);
			navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
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