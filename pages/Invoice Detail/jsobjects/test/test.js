export default {
		report:()=>{
		return Object.keys(Default_invoice).map((key)=>({key,...Default_invoice[key]}))
	},
}