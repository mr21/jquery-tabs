function lg(s) { console.log(s); }

$(function() {
	var
		tabNumber = 0,
		plugin_tabs = $.plugin_tabs($('#demo'), {
			// noDragndrop: true,
			// duration: 200,
			onChange: function(jq_tab, jq_content) {
				lg('>>> callback_onChange')
				lg(jq_tab.find('span').text());
				lg(jq_content.find('p').text().substr(0, 25));
				lg('');
			},
			onNewTab: function(jq_tab, jq_content) {
				lg('>>> callback_onNewTab')
				jq_tab.html(
					'<div>'+
						'<span>NewTab-'+(++tabNumber)+'</span>'+
						'<a class="jqtabs-close fa fa-times-circle" href="#"></a>'+
					'</div>'
				);
				jq_content.html(
					'<p>NewTab: <b>'+tabNumber+'</b></p>'
				);
			}
		}),
		tabsA = plugin_tabs.container['tabs_A']
	;

	$('.newTabAppend') .click(function() { tabsA.newTabAppend();  });
	$('.newTabPrepend').click(function() { tabsA.newTabPrepend(); });

	window.tabsA = tabsA; // debug
});
