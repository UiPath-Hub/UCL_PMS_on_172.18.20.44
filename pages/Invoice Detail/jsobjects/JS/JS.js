export default {
	onEditItemClick:()=>{
		showModal(Modal_ManageItem.name);
		
	},
	onConfirmEditItem: async()=>{
		let i = 0;
		while(i< Configs.invoice_items.length){
			let ele= Configs.invoice_items[i];
			if(ele.INVOICE_DETAIL_ID==Table_PMS_INVOICE_DETAIL_LM.selectedRow.INVOICE_DETAIL_ID){
				//console.log(ele.DETAIL_REMARK);
				ele.DETAIL_REMARK = DETAIL_REMARK.text;
				break;
			}
			i++;
		}
		await resetWidget("Table_PMS_INVOICE_DETAIL_LM",false);
		closeModal(Modal_ManageItem.name);
	},
	onDeleteButtonClick:async ()=>{
		if(await Init.permissionsCheck(Configs.permissions.EDIT,false)){
			showModal(MODAL_DELETE.name);
		}
	},
	onDeleteConfirmClick:async()=>{
		if(await Init.permissionsCheck(Configs.permissions.EDIT,false)){
			await UPDATE_DELETE_INVOICE.run();
			await closeModal(MODAL_DELETE.name);
			navigateTo('Invoice Dashboard', {}, 'SAME_WINDOW');
		}		
	},
	onDeleteItemClick:async()=>{
		let i = 0;
				Configs.invoice_items = Configs.invoice_items.filter((ele)=>ele.INVOICE_DETAIL_ID!=Table_PMS_INVOICE_DETAIL_LM.selectedRow.INVOICE_DETAIL_ID);


		await resetWidget("Table_PMS_INVOICE_DETAIL_LM",false);
	},
	onAddNewItem:async ()=>{
		showModal(Modal_Add.name)
	},
	onAddNewItemConfirm:async ()=>{
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
	}
}