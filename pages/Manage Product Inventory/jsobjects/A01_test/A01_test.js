export default {
	myVar1: ()=>{
		return moment(START_DATE.formattedDate,Configs.dateFormat).format("YYYY-MM-DD")
	}
}