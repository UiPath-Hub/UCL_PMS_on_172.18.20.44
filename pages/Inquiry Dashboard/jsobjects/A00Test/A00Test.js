export default {
	returnn:()=>{
		return moment(DATE.formattedDate,Configs.dateFormat).startOf('day').format("YYYY-MM-DD")
	}
}