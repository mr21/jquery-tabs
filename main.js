function lg(s) { console.log(s); }

$(function() {
	var
		plugin_tabs = $.plugin_tabs($('#demo'), {
			// noDragndrop: true,
			onChange: function(jq_tab, jq_content) {
				lg('>>> onChange');
				lg(jq_tab);
				lg(jq_content);
				lg('');
			}
		}),
		plugin_dragndrop = plugin_tabs.dragndrop();

	if (plugin_dragndrop) {
		plugin_dragndrop.duration(200);
		/*plugin_tabs.dragndrop().onDrop(function() {
			lg('onDrop')
			lg(arguments)
		});*/
	}

	var tabsA = plugin_tabs.container['tabs_A'];
});
