export default {
	onClick_BUTTON_SEARCH:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await resetWidget(PMS_PRODUCT_INVENTORY_LM.widgetName);
		SP_SER_SEARCH_FOR_PRODUCT_INV.run();
	},
	onNewInventoryClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		removeValue('EditInventory').then(() => {
			navigateTo('Manage Product Inventory', {}, 'SAME_WINDOW');
		});
	},
	onEditInventoryClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		storeValue('EditInventory', PMS_PRODUCT_INVENTORY_LM.selectedRow).then(() => {
			navigateTo('Manage Product Inventory', {}, 'SAME_WINDOW');
		});
	}
}