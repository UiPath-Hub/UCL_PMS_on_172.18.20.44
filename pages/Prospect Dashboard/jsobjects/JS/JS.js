export default {
	loadTable:async(tableName)=>{
		let data = await TableDisplay[tableName].run();
		if(data[0].TOTAL_RECORDS > 0){
			TableDisplay[tableName].data = await Promise.all(data.map(async(row)=>{
				const displayRow = _.pick(row, Object.keys(TableDisplay[tableName].ColumnsMap));
				TableDisplay[tableName].DataColumns.forEach((DateColumnName)=>{
					if(displayRow[DateColumnName] !== undefined && displayRow[DateColumnName] !== null){
						displayRow[DateColumnName] = moment(displayRow[DateColumnName]).format(Configs.tableDataFormat);
					}
				})
				return _.mapKeys(displayRow, (value, key) => {
					return TableDisplay[tableName].ColumnsMap[key]
				})
			}))
			return true;
		}else return false;
	},
	search:async()=>{
		if(!Init.permissionsCheck(Configs.permissions.VIEW,false))return;
		if(await this.loadTable("PMS_PROSPECTS_LM")){
			console.log("Processed data",TableDisplay["PMS_PROSPECTS_LM"].data);
		}else{
			TableDisplay["PMS_PROSPECTS_LM"].data = []
		}
		resetWidget(PMS_PROSPECTS_LM.widgetName);
	}
}