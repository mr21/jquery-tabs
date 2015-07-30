$(function() {

	$( "#moreAt" )[ top.location === self.location ? "show" : "remove" ]();

	function show( cb, obj ) {
		lg( ">>> " + cb );
		lg( "    data : " + obj.data );
		lg( "    jqTab : '" + obj.jqTab.text() + "'" );
		lg( "    jqContent : '" + obj.jqContent.text() + "'" );
		lg( "" );
	}

	var
		tabNumber = 0,
		plugin_tabs = $.plugin_tabs( document.body, {
			// noDragndrop: true,
			// duration: 200,
			onChange: function( o ) {
				show( "onChange", o );
			},
			onNewTab: function( o ) {
				show( "onNewTab", o );
				o.jqTab.html(
					"<div>"+
						"<span>NewTab-"+ (++tabNumber) +"</span>"+
						"<a class='jqtabs-btnCloseTab fa fa-times-circle' href='#'></a>"+
					"</div>"
				);
				o.jqContent.html(
					"<p>NewTab: <b>"+ tabNumber +"</b></p>"
				);
			},
			onBeforeRemoveTab: function( o ) {
				show( "onBeforeRemoveTab", o );
				if ( 0 ) { // block the deletion or not
					return false;
				}
			},
			onAfterRemoveTab: function( o ) {
				show( "onAfterRemoveTab", o );
				if ( 1 === o.jqTabsContainer.getTabs().length ) {
					o.jqTabsContainer.newTabAppend();
				}
			}
		}),
		tabsA = plugin_tabs.container[ "tabs_A" ]
	;

	$( ".newTabAppend" ) .click( function() { tabsA.newTabAppend(   "append-data" ); } );
	$( ".newTabPrepend" ).click( function() { tabsA.newTabPrepend( "prepend-data" ); } );
});
