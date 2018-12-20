let colNumber = 8;
let rowNumber = 8;
let playerTime = 60; //60s reflexion 
var currentCell = null;
// var pairColor = "#006090";
var pairColor = "#A8A7A7";
var impairColor = "#474747";
var selectColor = "#9999FF";
var focusColor = "#45ADA8";
var targetColor = "#99B898";
var killColor = "#E84A5F";
var timeLeft = playerTime; 
var timeElapsingLoop;	


$(document).ready(function ()
{
	$("#grid").html(createGrid(colNumber,rowNumber));
	$(".timer").css("width",$("#grid").css("width"));
	$(".timer #value").css("width",$("#grid").css("width"));
	startTimer();
	
	//$("#0").attr('src', 'data:image/gif;base(rowNumber * colNumber),R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
	$(".case").on('click', function()
	{
		console.log($(this).attr('id'));
		if($(this).attr("src") != "./res/noneColor.png" && $(this).attr("data-state") != "target")
		{
			if(currentCell != null)
			if($(this).attr('id') != currentCell.attr('id'))
			{
				initColorCase(currentCell);
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
						initColorCase($("#"+(i * colNumber + j)));
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
					else
						locked =true;

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
					// var dir = [[1,0],[0,1],[-1,0],[0,-1]];
					// for(var n = 0;n < 4;n++)
					// {
					// 	console.log("n = " + n);
					// 	var i = ((n%2 == 0) ? posX : posY) + dir[n][n%2];
					// 	var max_min = Math.abs(dir[n][(n-(n%2))/2]*((n%2 == 0) ? colNumber : rowNumber)) + !Math.abs(dir[n][(n-(n%2))/2])*dir[n][n%2];
					// 	if(i > 0 && i < ((n%2 == 0) ? colNumber : rowNumber))
					// 		while(i != max_min)
					// 		{
					// 			var targetPos = (((i * (n%2)) + (posY * !(n%2))) * colNumber + ((i * !(n%2)) + (posX * (n%2))));
					// 			console.log("id: "+targetPos);
					// 			if(targeting(targetPos,getElementColor($("#"+targetPos)),
					// 						objectColor))
					// 					break;
					// 			i+=dir[n][n%2];
					// 		}
					// }

					for(var i = posY+1;i<colNumber;i++)
					{
						var targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posY-1;i>=0;i--)
					{
						var targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX+1;i<rowNumber;i++)
					{
						var targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX-1;i>=0;i--)
					{
						var targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
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
						var targetPos = killPos[i][1] * colNumber + killPos[i][0];
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
							var targetPos = ((posY+(dir[n][1]*i)) * colNumber + (posX+(dir[n][0]*i)));
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
						var targetPos = killPos[i][1] * colNumber + killPos[i][0];
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
							var targetPos = ((posY+(dir[n][1]*i)) * colNumber + (posX+(dir[n][0]*i)));
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
						var targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posY-1;i>=0;i--)
					{
						var targetPos = (i * colNumber + posX);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX+1;i<rowNumber;i++)
					{
						var targetPos = (posY * colNumber + i);
						if(targeting(targetPos,
							getElementColor($("#"+targetPos)),
							objectColor))
							break;
					}
					for(var i = posX-1;i>=0;i--)
					{
						var targetPos = (posY * colNumber + i);
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
		else if($(this).attr("data-state") == "target")
		{
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
			console.log(objectColor + " has played");
			
			//for each cell with state target --> init color & state
			for(var i=0;i<rowNumber;i++)
			{
				for(var j = 0;j<colNumber;j++)
				{
					initColorCase($("#"+(i * colNumber + j)));
					$("#"+(i * colNumber + j)).attr("data-state","");
				}
			}
		}
		else if($(this).attr("data-state") == "")
		{
			for(var i=0;i<rowNumber;i++)
			{
				for(var j = 0;j<colNumber;j++)
				{
					initColorCase($("#"+(i * colNumber + j)));
					$("#"+(i * colNumber + j)).attr("data-state","");
				}
			}
		}
	});
	$(".case").mouseover(function()
	{
		//currentCell = $(this);
		if($(this).attr('data-state') != "focus" && $(this).attr('data-state') != "target")
			$(this).css('background',selectColor);
	});
	$(".case").mouseleave(function()
	{
		if($(this).attr('data-state') != "focus" && $(this).attr('data-state') != "target")
		{
			initColorCase($(this));
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
		//sol 1
		//textStruct
		/*
			id-Object-Color;

			ex:
			25-pawn-Black;
			26-pawn-White;
		*/
		//grid += i + "-" + getElementType($("#"+i)) + "-" + getElementColor($("#"+i)) + ";";
		//sol 2
		grid += "<img class='case' data-state='" + $("#"+i).attr("data-state") + "' data-pawn='" + $("#"+i).attr("data-pawn") + "' src='" + $("#"+i).attr("src") + "' id='" + i + "'/>";
		if(i%(colNumber-1)==0)
			grid+="<br>";
	}
	return grid;
}

function setActualGrid(newGrid)
{
	// for(var i = 0;i<colNumber*rowNumber;i++)
	// {
	// 	// $("#"+i)).attr("src")
	// }
	$('#grid').html(newGrid);
}

function updateTimer()
{
	let orientation = parseInt($(".timer").css("height")) > parseInt($(".timer").css("width")) ? "height" : "width";
	let step = parseFloat($(".timer").css(orientation))/playerTime;
	let guiVal = parseFloat($(".timer").css(orientation)) + ((timeLeft - playerTime) * step);
	$(".timer #value").css(orientation, guiVal);
}

function startTimer()
{
	timeElapsingLoop = setInterval(decreaseTimer,100);
}

function resetTimer()
{
	clearInterval(timeElapsingLoop);
	timeLeft = 15;
	updateTimer();
}

function decreaseTimer()
{
	timeLeft -= 0.1;
	updateTimer();
	if(timeLeft == 0) {
		alert("Time elapsed !");
		//skip turn
		resetTimer();
	}
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

function initColorCase(element)
{
	var x = (element.attr('id')%colNumber);
	var y = (element.attr('id')-x)/rowNumber;
	if(element.attr('id') % 2 == y%2)
		element.css('background',pairColor);
	else
		element.css('background',impairColor);
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
			var caseId = (i * nCol + j);
			html += "<img class='case' data-state='' ";
			
			if(caseId >= 0 && caseId < nPiece)
			{
				//black pieces
				color = "Black";
				if(caseId >= nPiece/2 && caseId <nPiece)
				{
					html+="src='./res/pawn"+color+".png' data-pawn='true' ";
				}
				else if(caseId == 0 || caseId == 7)
					html+="src='./res/tower"+color+".png' ";
				else if(caseId == 1 || caseId == 6)
					html+="src='./res/knight"+color+".png' ";
				else if(caseId == 2 || caseId == 5)
					html+="src='./res/bishop"+color+".png' ";
				else if(caseId == 3)
					html+="src='./res/queen"+color+".png' ";
				else if(caseId == 4)
					html+="src='./res/king"+color+".png' ";
			}
			else if(caseId >= (rowNumber * colNumber) - nPiece && caseId < (rowNumber * colNumber))
			{
				//white pieces
				color = "White";
				if(caseId >= (rowNumber * colNumber) - nPiece && caseId < (rowNumber * colNumber) - nPiece/2)
				{
					html+="src='./res/pawn"+color+".png' data-pawn='true' ";
				}
				else if(caseId == 56 || caseId == 63)
					html+="src='./res/tower"+color+".png' ";
				else if(caseId == 57 || caseId == 62)
					html+="src='./res/knight"+color+".png' ";
				else if(caseId == 58 || caseId == 61)
					html+="src='./res/bishop"+color+".png' ";
				else if(caseId == 59)
					html+="src='./res/queen"+color+".png' ";
				else if(caseId == 60)
					html+="src='./res/king"+color+".png' ";
			}
			else
			{
				html+="src='./res/noneColor.png' ";
			}
			if(caseId % 2 == i%2)
				html+="style='background:"+pairColor+";' ";
			else
				html+="style='background:"+impairColor+";' ";

		  	html+="id='" + caseId + "'/>";
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