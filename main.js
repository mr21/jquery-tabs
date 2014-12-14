function lg(s) { console.log(s); }

$(function() {
	function show(cb, jq_tab, jq_content) {
		lg('>>> ' + cb)
		lg(jq_tab.find('span').text());
		lg(jq_content.find('p').text().substr(0, 25));
		lg('');
	}

	var
		tabNumber = 0,
		plugin_tabs = $.plugin_tabs(document.body, {
			// noDragndrop: true,
			// duration: 200,
			onChange: function(jq_tab, jq_content) {
				show('onChange', jq_tab, jq_content);
			},
			onNewTab: function(jq_tab, jq_content) {
				lg('>>> callback_onNewTab')
				jq_tab.html(
					'<div>'+
						'<span>NewTab-'+(++tabNumber)+'</span>'+
						'<a class="jqtabs-btnCloseTab fa fa-times-circle" href="#"></a>'+
					'</div>'
				);
				jq_content.html(
					'<p>NewTab: <b>'+tabNumber+'</b></p>'
				);
			},
			onBeforeRemoveTab: function(jq_tab, jq_content) {
				show('onBeforeRemoveTab', jq_tab, jq_content);
				if (0) // block the deletion or not
					return false;
			},
			onAfterRemoveTab: function(jq_tab, jq_content, container) {
				show('onAfterRemoveTab', jq_tab, jq_content);
				if (1 === container.getTabs().length)
					container.newTabAppend();
			}
		}),
		tabsA = plugin_tabs.container['tabs_A']
	;

	$('.newTabAppend') .click(function() { tabsA.newTabAppend();  });
	$('.newTabPrepend').click(function() { tabsA.newTabPrepend(); });
});
