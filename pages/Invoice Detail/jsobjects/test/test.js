export default {
		report:()=>{
		return Object.keys(PMS_INVOICE_LM).map((key)=>({key,...PMS_INVOICE_LM[key]}))
	},
}