export default {
	onClick_BUTTON_SEARCH:async()=>{
		await resetWidget(PMS_PRODUCT_INVENTORY_LM.widgetName);
		SP_SER_SEARCH_FOR_PRODUCT_INV.run();
	},
	onNewInventoryClick:()=>{
		removeValue('EditInventory').then(() => {
			navigateTo('Manage Product Inventory', {}, 'SAME_WINDOW');
		});
	},
	onEditInventoryClick:()=>{
		storeValue('EditInventory', PMS_PRODUCT_INVENTORY_LM.selectedRow).then(() => {
			navigateTo('Manage Product Inventory', {}, 'SAME_WINDOW');
		});
	}
}