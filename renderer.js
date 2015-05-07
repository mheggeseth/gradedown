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
	return oldTableRow.apply(renderer,[content]);
}

var oldTableCell = renderer.tablecell;
renderer.tablecell = function(content,flags)
{
	return oldTableCell.apply(renderer,[content,flags]);
}