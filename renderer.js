var renderer = new marked.Renderer();
marked.setOptions({ renderer: renderer });

var oldTable = renderer.table;
renderer.table = function(header,body)
{
	return oldTable.apply(renderer,[header,body]);
}

var oldTableRow = renderer.tablerow;
renderer.tablerow = function(content)
{
	content = oldTableRow.apply(renderer,[content]);

	var container = document.createElement('tbody');
	container.innerHTML = content;
	var tds = container.getElementsByTagName('td');
	if (tds.length === 3)
	{
		//3 cells means it's a deduction row, so add the Odd class
		var tr = container.getElementsByTagName('tr')[0];
		tr.className += " Odd";
	}

	return container.innerHTML;
}

var oldTableCell = renderer.tablecell;
renderer.tablecell = function(content,flags)
{
	var isTitle = content.toLowerCase().indexOf("$title$") === 0;
	var isSubtitle = content.toLowerCase().indexOf("$subtitle$") === 0;
	var isDeductionValue = content.toLowerCase().indexOf("$d$") === 0;
	if (isTitle || isSubtitle)
	{
		content = content.replace("$title$", "");
		content = content.replace("$subtitle$", "");
		content = content.replace(/^\s+/,"");
		
		if (isSubtitle)
		{
			content = "<em>" + content + "</em>";
		}
		content = "<div class=\"SmallSpacerAbove\">" + content + "</div>";
		content = oldTableCell.apply(renderer,[content,flags]);
		
		var container = document.createElement('tr');
		container.innerHTML = content;
		
		var td = container.getElementsByTagName('td')[0];
		td.colSpan = 3;
		
		if (isTitle)
		{
			var div = container.getElementsByTagName('div')[0];
			div.className += " Bold";
		}
		
		return container.innerHTML;
	}
	else if (isDeductionValue)
	{
		content = content.replace("$d$", "");
		content = content.replace(/^\s+/,"");

		content = oldTableCell.apply(renderer,[content,flags]);

		var container = document.createElement('tr');
		container.innerHTML = content;

		var td = container.getElementsByTagName('td')[0];
		td.className += " Center NoWrap";
		return container.innerHTML;
		
	}
	else
	{
		return oldTableCell.apply(renderer,[content,flags]);
	}
}