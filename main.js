function lg(s) { console.log(s); }

$(function() {
	var
		plugin_tabs = $.plugin_tabs($('#demo'), {
			// noDragndrop: true,
			// duration: 200,
			onChange: function(jq_tab, jq_content) {
				lg('>>> callback_onChange')
				lg(jq_tab);
				lg(jq_content);
				lg('');
			},
			onNewTab: function(jq_tab, jq_content) {
				lg('>>> callback_onNewTab')
				jq_tab.html(
					'<div>'+
						'<span>newTab</span>'+
						'<a class="jqtabs-close fa fa-times-circle" href="#"></a>'+
					'</div>'
				);
			}
		}),
		tabsA = plugin_tabs.container['tabs_A']
	;

	$('.newTabAppend') .click(function() { tabsA.newTabAppend();  });
	$('.newTabPrepend').click(function() { tabsA.newTabPrepend(); });

	window.tabsA = tabsA; // debug
});
