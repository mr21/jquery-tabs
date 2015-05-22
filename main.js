function lg(s) { console.log(s); }

$(function() {
	$('#moreAt')[top.location === self.location ? 'show' : 'remove']();

	function show(cb, jq_tab, jq_content) {
		lg('>>> ' + cb)
		lg('tab     : "' + jq_tab.find('span').text() + '"');
		lg('content : "' + jq_content.find('p').text() + '"');
		lg('');
	}

	var
		tabNumber = 0,
		plugin_tabs = $.plugin_tabs(document.body, {
			// noDragndrop: true,
			// duration: 200,
			onChange: function(o) {
				show('onChange', o.jqTab, o.jqContent);
			},
			onNewTab: function(o) {
				lg('>>> callback_onNewTab')
				o.jqTab.html(
					'<div>'+
						'<span>NewTab-'+(++tabNumber)+'</span>'+
						'<a class="jqtabs-btnCloseTab fa fa-times-circle" href="#"></a>'+
					'</div>'
				);
				o.jqContent.html(
					'<p>NewTab: <b>'+tabNumber+'</b></p>'
				);
			},
			onBeforeRemoveTab: function(o) {
				show('onBeforeRemoveTab', o.jqTab, o.jqContent);
				if (0) // block the deletion or not
					return false;
			},
			onAfterRemoveTab: function(o) {
				show('onAfterRemoveTab', o.jqTab, o.jqContent);
				if (1 === o.jqTabsContainer.getTabs().length)
					o.jqTabsContainer.newTabAppend();
			}
		}),
		tabsA = plugin_tabs.container['tabs_A']
	;

	$('.newTabAppend') .click(function() { tabsA.newTabAppend();  });
	$('.newTabPrepend').click(function() { tabsA.newTabPrepend(); });
});
