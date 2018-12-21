let colNumber = 8;
let rowNumber = 8;
let playerTime = 60; //60s reflexion 
var currentCell = null;
// var evenCellColor = "#006090";
let evenCellColor = "#A8A7A7";
let oddCellColor = "#474747";
let selectColor = "#9999FF";
let focusColor = "#45ADA8";
let targetColor = "#99B898";
let killColor = "#E84A5F";
var timeLeft = playerTime; 
var timeElapsingLoop;	

window.addEventListener("resize", resizeEvent);


function resizeEvent()
{
	console.log("Window resized");
	//TODO find alternative
	location.reload();
}

$(document).ready(function ()
{
	$("#grid").html(createGrid(colNumber,rowNumber));
	$(".Timer").css("width",$("#grid").css("width"));
	$(".Timer #value").css("width",$("#grid").css("width"));
	$(".Console #infoLogger").css("height",$("#grid").css("height"));
	startTimer();
	logInfo("Game started !");
	
	//$("#0").attr('src', 'data:image/gif;base(rowNumber * colNumber),R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
	$(".Cell").on('click', function()
	{
		console.log($(this).attr('id'));
		if($(this).attr("src") != "./res/noneColor.png" && $(this).attr("data-state") != "target")
		{
			if(currentCell != null)
			if($(this).attr('id') != currentCell.attr('id'))
			{
				initColorCell(currentCell);
				currentCell.attr("data-state","");
			}
			currentCell = $(this);
			currentCell.css("background",focusColor);
			currentCell.attr("data-state","focus");
			var objectId = currentCell.attr('id');
			var object = currentCell.attr('src');
			
			var objectType = object.substr(6,object.length-4-5-6);
			var objectColor = getElementColor(currentCell);
			
			// console.log(objectId);
			console.log(objectType);
			var posX = "";
			var posY = "";

			//currentCell.

			//for each cell with state target --> init color
			for(var i=0;i<rowNumber;i++)
			{
				for(var j = 0;j<colNumber;j++)
				{
					if((i * colNumber + j)!=objectId)
					{
						initColorCell($("#"+(i * colNumber + j)));
						$("#"+(i * colNumber + j)).attr("data-state","");
					}
					else
					{
						posX = j;
						posY = i;
					}
				}
			}

			// easy way to retrieve position
			// posX = (objectId%colNumber);
			// posY = (objectId-x)/rowNumber;
			

			switch(objectType)
			{
				case 'pawn':

					var locked = false;
					if(objectColor == "Black")
					{
						var posD1 = ((posY+1) * colNumber + posX);
						var posD2 = ((posY+2) * colNumber + posX);

						var posT1 = ((posY+1) * colNumber + (posX+1));
						var posT2 = ((posY+1) * colNumber + (posX-1));
					}
					else if(objectColor == "White")
					{
						var posD1 = ((posY-1) * colNumber + posX);
						var posD2 = ((posY-2) * colNumber + posX);

						var posT1 = ((posY-1) * colNumber + (posX+1));
						var posT2 = ((posY-1) * colNumber + (posX-1));
					}
					//simple moves
					//if cell D1 is free
					if(posD1<rowNumber*colNumber && posD1 > 0)
					if(getElementType($("#"+posD1)) == "none")
					{
						$("#"+posD1).attr("data-state","target");
						$("#"+posD1).css("background",targetColor);
					}
					else {
						locked =true;
					}

					//if cell D2 is free
					if(posD2<rowNumber*colNumber && posD2 > 0)
					if(getElementType($("#"+posD2)) == "none" && !locked && $("#"+objectId).attr('data-pawn') == 'true')
					{
						$("#"+posD2).attr("data-state","target");
						$("#"+posD2).css("background",targetColor);
					}

					//kill target 
					var colorT1 = getElementColor($("#"+posT1));
					var colorT2 = getElementColor($("#"+posT2));
					if(getElementType($("#"+posT1)) != "none" && 
						colorT1 != objectColor)
					{
						$("#"+posT1).attr("data-state","target");
						$("#"+posT1).css("background",killColor);
						console.log("x");
					}
					if(getElementType($("#"+posT2)) != "none" && 
						colorT2 != objectColor)
					{
						$("#"+posT2).attr("data-state","target");
						$("#"+posT2).css("background",killColor);
						console.log("x");
					}
					
					break;
				case 'tower':
					// beta version
					//TODO: refactor this method --> redundancy
					// let dir = [[1,0],[0,1],[-1,0],[0,-1]];
					// for(var n = 0;n < 4;n++)
					// {
					// 	console.log("n = " + n);
					// 	var i = ((n%2 == 0) ? posX : posY) + dir[n][n%2];
					// 	let max_min = Math.abs(dir[n][(n-(n%2))/2]*((n%2 == 0) ? colNumber : rowNumber)) + !Math.abs(dir[n][(n-(n%2))/2])*dir[n][n%2];
					// 	if(i > 0 && i < ((n%2 == 0) ? colNumber : rowNumber))
					// 		while(i != max_min)
					// 		{
					// 			let targetPos = (((i * (n%2)) + (posY * !(n%2))) * colNumber + ((i * !(n%2)) + (posX * (n%2))));
					// 			console.log("id: "+targetPos);
					// 			if(targeting(targetPos,getElementColor($("#"+targetPos)),
					// 						objectColor))
					// 					break;
					// 			i+=dir[n][n%2];
					// 		}
					// }

					for(var i = posY+1;i<colNumber;i++)
					{
						let targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor)) {
							break;
						}	
					}
					for(var i = posY-1;i>=0;i--)
					{
						let targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor)) {
							break;
						}	
					}
					for(var i = posX+1;i<rowNumber;i++)
					{
						let targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor)) {
							break;
						}	
					}
					for(var i = posX-1;i>=0;i--)
					{
						let targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor)) {
							break;
						}	
					}
					break;
				case 'knight':
					var killPos = [[posX-2,posY-1],[posX-1,posY-2],
									[posX+1,posY-2],[posX+2,posY-1],
									[posX+2,posY+1],[posX+1,posY+2],
									[posX-1,posY+2],[posX-2,posY+1]];
					for(var i = 0;i<8;i++)
					{
						//i * colNumber + j
						let targetPos = killPos[i][1] * colNumber + killPos[i][0];
						if(killPos[i][1] >= 0 && 
							killPos[i][1] < rowNumber && 
							killPos[i][0] >= 0 && 
							killPos[i][0] < colNumber)
							targeting(targetPos,getElementColor($("#"+targetPos)),objectColor);
					}
					break;
				case 'bishop':
					var dir = [[1,1],[-1,1],[-1,-1],[1,-1]];
					for(var n = 0;n < 4;n++)
					{
						var i = 1;
						while((posY+(dir[n][1]*i) < rowNumber && 
							(posX+(dir[n][0]*i)) < colNumber) &&
							(posY+(dir[n][1]*i)) >= 0 &&
							(posX+(dir[n][0]*i)) >= 0)
						{
							let targetPos = ((posY+(dir[n][1]*i)) * colNumber + (posX+(dir[n][0]*i)));
							if(targeting(targetPos,
								getElementColor($("#"+targetPos)),
								objectColor))
								break;
							i++;
						}
					}
					
					break;
				case 'king':
					var killPos = [[posX-1,posY-1],[posX,posY-1],[posX+1,posY-1],
									[posX-1,posY],[posX+1,posY],
									[posX-1,posY+1],[posX,posY+1],[posX+1,posY+1]];
					for(var i = 0;i<8;i++)
					{
						//i * colNumber + j
						let targetPos = killPos[i][1] * colNumber + killPos[i][0];
						if(targetPos>=0 && targetPos < colNumber*rowNumber)
							targeting(targetPos,getElementColor($("#"+targetPos)),objectColor);
					}
					break;
				case 'queen':
				//diag
					var dir = [[1,1],[-1,1],[-1,-1],[1,-1]];
					for(var n = 0;n < 4;n++)
					{
						var i = 1;
						while((posY+(dir[n][1]*i) < rowNumber && 
							(posX+(dir[n][0]*i)) < colNumber) &&
							(posY+(dir[n][1]*i)) >= 0 &&
							(posX+(dir[n][0]*i)) >= 0)
						{
							let targetPos = ((posY+(dir[n][1]*i)) * colNumber + (posX+(dir[n][0]*i)));
							if(targeting(targetPos,
								getElementColor($("#"+targetPos)),
								objectColor))
								break;
							i++;
						}
					}
				//cartesian
					for(var i = posY+1;i<colNumber;i++)
					{
						let targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posY-1;i>=0;i--)
					{
						let targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX+1;i<rowNumber;i++)
					{
						let targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX-1;i>=0;i--)
					{
						let targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					break;
				default:
					break;
			}
		}
		else if($(this).attr("data-state") == "target") {
			var target = getElementType($(this));
			var element = getElementType(currentCell);

			askGameUpdate(getActualGrid(),element,target);

			if(element=='pawn')
			{
				currentCell.attr("data-pawn","false");
			}

			if(target == 'pawn')
			{
				$(this).attr("data-pawn","false");
			}

			var prev = currentCell.attr("src");
			currentCell.attr('src', './res/noneColor.png');
			$(this).attr("src",prev);
			//player has played
			resetTimer();
			console.log(objectColor + " has played");
			
			//for each cell with state target --> init color & state
			for(var i=0;i<rowNumber;i++)
			{
				for(var j = 0;j<colNumber;j++)
				{
					initColorCell($("#"+(i * colNumber + j)));
					$("#"+(i * colNumber + j)).attr("data-state","");
				}
			}
		}
		else if ($(this).attr("data-state") == "")
		{
			for(var i=0;i<rowNumber;i++)
			{
				for(var j = 0;j<colNumber;j++)
				{
					initColorCell($("#"+(i * colNumber + j)));
					$("#"+(i * colNumber + j)).attr("data-state","");
				}
			}
		}
	});
	$(".Cell").mouseover(function()
	{
		//currentCell = $(this);
		if($(this).attr('data-state') != "focus" && $(this).attr('data-state') != "target")
			$(this).css('background',selectColor);
	});
	$(".Cell").mouseleave(function()
	{
		if($(this).attr('data-state') != "focus" && $(this).attr('data-state') != "target")
		{
			initColorCell($(this));
		}
	});
});

function targeting(elementPos,elementColor,actualColor)
{
	if(elementPos < rowNumber*colNumber)
	{
		if(getElementType($("#"+elementPos)) == "none")
		{
			$("#"+elementPos).attr("data-state","target");
			$("#"+elementPos).css("background",targetColor);
		}
		else if(getElementType($("#"+elementPos)) != "none" &&
			elementColor != actualColor)
		{
			$("#"+elementPos).attr("data-state","target");
			$("#"+elementPos).css("background",killColor);
			console.log("possible target: " + getElementType($("#"+elementPos)));
			return true;
		}
		else
			return true;
	}
	
}

function getActualGrid()
{
	var grid = "";
	for(var i = 0;i<colNumber*rowNumber;i++)
	{
		grid += "<img class='Cell' data-state='" + $("#"+i).attr("data-state") + "' data-pawn='" + $("#"+i).attr("data-pawn") + "' src='" + $("#"+i).attr("src") + "' id='" + i + "'/>";
		if(i%(colNumber-1)==0) {
			grid+="<br>";
		}
	}
	return grid;
}

function setActualGrid(newGrid)
{
	$('#grid').html(newGrid);
}

function updateTimer()
{
	let orientation = parseInt($(".Timer").css("height")) > parseInt($(".Timer").css("width")) ? "height" : "width";
	let step = parseFloat($(".Timer").css(orientation))/playerTime;
	let guiVal = parseFloat($(".Timer").css(orientation)) + ((timeLeft - playerTime) * step);
	$(".Timer #value").css(orientation, guiVal);
}

function startTimer()
{
	timeElapsingLoop = setInterval(decreaseTimer,100);
}

function resetTimer()
{
	clearInterval(timeElapsingLoop);
	timeLeft = playerTime;
	updateTimer();
}

function decreaseTimer()
{
	timeLeft -= 0.1;
	updateTimer();
	
	if(timeLeft <= 0) {
		alert("Time elapsed !");
		logInfo("Your time has elapsed, your turn has been skipped");
		//skip turn
		resetTimer();
	}
}

function logInfo(msg)
{
	var text = $(".Console #infoLogger").html();
	let d = new Date();
	text += d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " : " + String(msg) + "\n";
	$(".Console #infoLogger").html(text);
	console.clear();
	console.log(text);
}

function getElementColor(element)
{
	//6 --> ./res/
	//4 --> .png
	//5 --> color: Black/White
	return element.attr("src").substr(length-4-5,5);
}

function getElementType(element)
{
	//6 --> ./res/
	//4 --> .png
	//5 --> color: Black/White
	return element.attr("src").substr(6,element.attr("src").length-4-5-6);
}

function initColorCell(element)
{
	var x = (element.attr('id')%colNumber);
	var y = (element.attr('id')-x)/rowNumber;
	if(element.attr('id') % 2 == y%2)
		element.css('background',evenCellColor);
	else
		element.css('background',oddCellColor);
}

function createGrid(nCol,nRow)
{
	var html = "";
	var color = "";
	var nPiece = 16;
	for(var i=0;i<nRow;i++)
	{
		for(var j = 0;j<nCol;j++)
		{
			var CellId = (i * nCol + j);
			html += "<img class='Cell' data-state='' ";
			
			if(CellId >= 0 && CellId < nPiece)
			{
				//black pieces
				color = "Black";
				if(CellId >= nPiece/2 && CellId <nPiece)
				{
					html+="src='./res/pawn"+color+".png' data-pawn='true' ";
				}
				else if(CellId == 0 || CellId == 7)
					html+="src='./res/tower"+color+".png' ";
				else if(CellId == 1 || CellId == 6)
					html+="src='./res/knight"+color+".png' ";
				else if(CellId == 2 || CellId == 5)
					html+="src='./res/bishop"+color+".png' ";
				else if(CellId == 3)
					html+="src='./res/queen"+color+".png' ";
				else if(CellId == 4)
					html+="src='./res/king"+color+".png' ";
			}
			else if(CellId >= (rowNumber * colNumber) - nPiece && CellId < (rowNumber * colNumber))
			{
				//white pieces
				color = "White";
				if(CellId >= (rowNumber * colNumber) - nPiece && CellId < (rowNumber * colNumber) - nPiece/2)
				{
					html+="src='./res/pawn"+color+".png' data-pawn='true' ";
				}
				else if(CellId == 56 || CellId == 63)
					html+="src='./res/tower"+color+".png' ";
				else if(CellId == 57 || CellId == 62)
					html+="src='./res/knight"+color+".png' ";
				else if(CellId == 58 || CellId == 61)
					html+="src='./res/bishop"+color+".png' ";
				else if(CellId == 59)
					html+="src='./res/queen"+color+".png' ";
				else if(CellId == 60)
					html+="src='./res/king"+color+".png' ";
			}
			else
			{
				html+="src='./res/noneColor.png' ";
			}
			if(CellId % 2 == i%2)
				html+="style='background:"+evenCellColor+";' ";
			else
				html+="style='background:"+oddCellColor+";' ";

		  	html+="id='" + CellId + "'/>";
		}
		html += "<br>";
	}
	return html;
}

function askGameUpdate(actualGrid,element,target)
{
	console.log("element: " + element);
	console.log("target: " + target);
	$.ajax({
		url:"TTTServer.php",
		data: 'grid='+actualGrid+'&command=update',
		type:'POST',
		datatype:'text',
		success: function(rsp){
			alert("ok");
			alert(rsp[0]);
			$('#logPanel').html(rsp);
			startTimer();
		}
	});
}
function connect()
{
	if($('#lbUserName').val() != "" && $('#lbPassword').val() != "")
	{
		var username = $('#lbUserName').val();
		var password = $('#lbPassword').val();

		$.ajax({
			url:"TTTserver.php",
			data: 'username='+username+'&password='+password+'&command=identification',
			type:'POST',
			datatype:'json',
			success: function(rsp){			
				if(rsp['Name'] == username)
				{
					$("#title").html("Welcome " + username);
					$("#grid").css("visibility","visible");
					$("#connectionPanel").css("visibility","hidden");
				}
				else
				{
					
				}
				
			}
		});
	}
	else
	{
		alert("Wrong username or wrong password");
	}	
}