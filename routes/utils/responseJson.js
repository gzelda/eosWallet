/*
{
	"code":,		  0:fail 1:success 2:error
	"status":,		  code的状态描述（表格）
	"data":{
		"ethBalance": double,
		"bgsBalance": double
	}
}
*/
function generateJson(code,status,data){
	var json = {
		"code":code,
		"status":status,
		"data":data
	};
	console.log("here",json);
	return json;
}



module.exports = {
 generateJson
}