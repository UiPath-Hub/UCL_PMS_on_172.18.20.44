export default {
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