$(document).ready(function () 
{
	$("#generatedId").html(generateID());
});
//generate a random user ID
function generateID()
{
	var text = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	for (var i = 0; i < 8; i++)
	text += characters.charAt(Math.floor(Math.random() * characters.length));
	console.log(text);
	return text;
}