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
		
		tds[1].className += " Center NoWrap"; //Add deduction classes to second TD
	}

	return container.innerHTML;
}

var oldTableCell = renderer.tablecell;
renderer.tablecell = function(content,flags)
{
	var titleMarker = "$ ";
	var subTitleMarker = "$$ ";
	var isTitle = content.toLowerCase().indexOf(titleMarker) === 0;
	var isSubtitle = content.toLowerCase().indexOf(subTitleMarker) === 0;
	if (isTitle || isSubtitle)
	{
		if (isTitle) content = content.replace(titleMarker, "");
		if (isSubtitle) content = content.replace(subTitleMarker, "");
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
	else
	{
		return oldTableCell.apply(renderer,[content,flags]);
	}
}