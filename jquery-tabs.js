/*
	jQuery - tabs - 1.6.0
	https://github.com/Mr21/jquery-tabs
*/

$.plugin_tabs = function( parent, options ) {
	return new $.plugin_tabs.obj(
		parent.jquery
			? parent.eq( 0 )
			: $( parent ),
		options || {}
	);
};

$.plugin_tabs.obj = function( jqParent, options ) {

	// Setting of all the className.
	this.class_container      = options.class_container      || "jqtabs";
	this.class_tabs           = options.class_tabs           || "jqtabs-tabs";
	this.class_tab            = options.class_tab            || "jqtabs-tab";
	this.class_tabActive      = options.class_tabActive      || "jqtabs-tabActive";
	this.class_tabHole        = options.class_tabHole        || "jqtabs-tabHole";
	this.class_contents       = options.class_contents       || "jqtabs-contents";
	this.class_content        = options.class_content        || "jqtabs-content";
	this.class_contentActive  = options.class_contentActive  || "jqtabs-contentActive";
	this.class_btnNewTab      = options.class_btnNewTab      || "jqtabs-btnNewTab";
	this.class_btnCloseTab    = options.class_btnCloseTab    || "jqtabs-btnCloseTab";
	this.class_tabClosing     = options.class_tabClosing     || "jqtabs-tabClosing";
	this.class_contentClosing = options.class_contentClosing || "jqtabs-contentClosing";

	// The container who wraps all the <div class=".jqTabs"/>.
	this.jqParent = jqParent;

	this.container = [];
	if ( !options.noDragndrop && $.plugin_dragndrop ) {
		this._dragndropInit();
	}
	this.applyThis( options.applyThis );
	this.duration( options.duration === undefined ? 200 : options.duration );

	// Setting of the user's callbacks.
	this.onChange( options.onChange );
	this.onNewTab( options.onNewTab );
	this.onBeforeRemoveTab( options.onBeforeRemoveTab );
	this.onAfterRemoveTab( options.onAfterRemoveTab );

	this._watchDom();
	this._initContainer( jqParent );
};

$.plugin_tabs.obj.prototype = {

	// public:
	applyThis: function( app ) {
		if ( app !== undefined ) {
			return this.app = app, this;
		}
		return this.app;
	},
	duration: function( ms ) {
		if ( arguments.length === 0 ) {
			return this.ms;
		}
		this.ms = ms;
		if ( this.plugin_dragndrop ) {
			this.plugin_dragndrop.duration( ms );
		}
		return this;
	},
	onChange: function( f ) { this.cbChange = f; return this; },
	onNewTab: function( f ) { this.cbNewTab = f; return this; },
	onBeforeRemoveTab: function( f ) { this.cbBeforeRemoveTab = f; return this; },
	onAfterRemoveTab:  function( f ) { this.cbAfterRemoveTab  = f; return this; },

	// private:
	_initContainer: function( jqElem ) {
		var that = this;

		if ( !jqElem.hasClass( this.class_container ) ) {
			jqElem = jqElem.find( "." + this.class_container );
		}

		jqElem.each(function() {
			if ( !this._jqtabs_ready ) {
				var
					jqThis = $( this ),
					obj = new $.plugin_tabs.container( jqThis, that )
				;
				this._jqtabs_ready = true;
				if ( this.id ) {
					that.container[ this.id ] = obj;
				} else {
					that.container.push( obj );
				}
			}
		});
	},
	_watchDom: function() {
		var that = this;
		this.jqParent.on( "DOMNodeInserted", function( e ) {
			that._initContainer( $( e.target ) );
		});
	},
	_dragndropInit: function() {
		this.plugin_dragndrop =
			$.plugin_dragndrop( this.jqParent, {
				dropClass     : this.class_tabs,
				dragClass     : this.class_tab,
				dragHoleClass : this.class_tabHole,
				noSelection   : true
			})
			.onDrag( function( jqDrops, jqTabs) {
				jqDrops[ 0 ]._jqtabs_container._onDrag( jqTabs );
			})
			.onDrop( function( jqDrops, jqTabs ) {
				var container = jqDrops[ 0 ]._jqtabs_container;
				jqTabs[ 0 ]._jqtabs_container = container;
				container._onDrop( jqTabs );
			})
		;
	}
};

$.plugin_tabs.container = function( jqParent, plugin_jqtabs ) {
	this.plugin_jqtabs = plugin_jqtabs;
	this.jqActiveTab = null;
	this.jqParent = jqParent;
	this.jqTabs = this.jqParent.find( "." + plugin_jqtabs.class_tabs );
	this.jqContents = this.jqParent.find( "." + plugin_jqtabs.class_contents );
	this.jqBtnNewTabs = this.jqTabs.find( "." + plugin_jqtabs.class_btnNewTab );
	this.jqTabs[ 0 ]._jqtabs_container = this;
	this._findTabs();
	this._init();
};

$.plugin_tabs.container.prototype = {

	// public:
	getTabs: function() {
		return this.jqArrayTabs;
	},
	getActiveTab: function() {
		return this.jqActiveTab;
	},
	getActiveContent: function() {
		return this.jqActiveTab
			? this.jqActiveTab[ 0 ]._jqtabs_jqContent
			: null;
	},
	prevTab: function() {
		this._clickTab( this.jqActiveTab.prevAll( "." + this.plugin_jqtabs.class_tab ).eq( 0 ) );
		return this;
	},
	nextTab: function() {
		this._clickTab( this.jqActiveTab.nextAll( "." + this.plugin_jqtabs.class_tab ).eq( 0 ) );
		return this;
	},
	newTabPrepend: function( data ) {
		var jqTabs = this.getTabs();
		this._newTab(
			data,
			jqTabs[ 0 ]
				? "insertBefore"
				: "prependTo",
			jqTabs[ 0 ]
				? jqTabs.eq( 0 )
				: this.jqTabs
		);
		return this;
	},
	newTabAppend:  function( data ) {
		var jqTabs = this.getTabs();
		this._newTab(
			data,
			jqTabs[ 0 ]
				? "insertAfter"
				: "prependTo",
			jqTabs[ 0 ]
				? jqTabs.eq( -1 )
				: this.jqTabs
		);
		return this;
	},
	removeTab: function( jqTab, delay ) {
		var
			that = this,
			jqContent = jqTab[ 0 ]._jqtabs_jqContent
		;

		// This part of code is inside a function because this code
		// will be executed right now or after a specific delay (ms).
		function f() {
			that._callEvents( "cbAfterRemoveTab", jqTab, jqContent );
			if ( jqTab[ 0 ] === that.jqActiveTab[ 0 ] ) {
				var jqNext = jqTab.nextAll( "."+ that.plugin_jqtabs.class_tab +":first" );
				if ( !jqNext[ 0 ] ) {
					jqNext = jqTab.prevAll( "."+ that.plugin_jqtabs.class_tab +":first" );
				}
			}
			jqTab.remove();
			jqContent.remove();
			that._findTabs();
			if ( jqNext ) {
				if ( jqNext[ 0 ] ) {
					that._clickTab( jqNext );
				} else {
					that.jqActiveTab = null;
				}
			}
		}

		// The user has the possibility to set a callback to decide
		// if the <div class="jqTab"/> has to be remove or not.
		// Like a confirm for example.
		if ( this._callEvents( "cbBeforeRemoveTab", jqTab, jqContent ) !== false ) {

			// If we didn't pass a delay to the .removeTab methode
			// we set the global duration setting by default
			if ( delay === undefined ) {
				delay = this.plugin_jqtabs.ms;
			}

			// If there is no delay we remove the <div class="jqTab"/> immediatly.
			if ( delay === 0 ) {
				f();
			} else {

				// If the user chose to animate the deletion of the <div class="jqTab"/>
				// we add a class to the elements to allow the user to put some CSS on his side.
				jqTab.addClass( this.plugin_jqtabs.class_tabClosing );
				jqContent.addClass( this.plugin_jqtabs.class_contentClosing );
				setTimeout( f, delay );
			}
		}

		return this;
	},

	// private:
	_callEvents: function( f, jqTab, jqContent ) {
		if ( f = this.plugin_jqtabs[ f ] ) {
			return f.call( this.plugin_jqtabs.app, {
				data: jqTab[ 0 ]._jqtabs_data,
				jqTab: jqTab,
				jqContent: jqContent,
				jqTabsContainer: jqTab[ 0 ]._jqtabs_container
			});
		}
	},
	_findTabs: function() {
		this.jqArrayTabs = this.jqTabs.children( "." + this.plugin_jqtabs.class_tab );
	},
	_newTab: function( data, attachFn, element ) {
		var
			jqTab = $( "<div>" )
				.addClass( this.plugin_jqtabs.class_tab )
				[ attachFn ]( element ),
			jqContent = $( "<div>" )
				.addClass( this.plugin_jqtabs.class_content )
				.appendTo( this.jqContents )
		;
		jqTab[ 0 ]._jqtabs_data = data;
		this._findTabs();
		this._callEvents( "cbNewTab", jqTab, jqContent );
		this._initTab( jqTab, jqContent );
		this._clickTab( jqTab );
	},
	_init: function() {
		var
			that = this,
			jqTabs = this.getTabs(),
			jqContents = this.jqContents.children( "." + this.plugin_jqtabs.class_content )
		;
		jqTabs.each( function( i ) {
			var jqTab = jqTabs.eq( i );
			that._initTab( jqTab, jqContents.eq( i ) );
			if ( jqTab.hasClass( that.plugin_jqtabs.class_tabActive ) )
				that._activeTab( jqTab );
		});
		this.jqBtnNewTabs.click( function() {
			that.newTabAppend();
			return false;
		});
		if ( !this.jqActiveTab && jqTabs[ 0 ] ) {
			this._activeTab( jqTabs.eq( 0 ) );
		}
	},
	_initTab: function( jqTab, jqContent ) {
		jqTab[ 0 ]._jqtabs_container = this;
		jqTab[ 0 ]._jqtabs_jqContent = jqContent;
		jqTab
			.find( "." + this.plugin_jqtabs.class_btnCloseTab )
				.mousedown( false )
				.click( function() {
					jqTab[ 0 ]._jqtabs_container.removeTab( jqTab );
					return false;
				})
		;
		jqTab
			.mousedown( function( e ) {
				if ( e.button === 0 ) {
					this._jqtabs_container._clickTab( jqTab );
				}
			})
		;
	},
	_activeTab: function( jqTab ) {
		this.jqActiveTab = jqTab.addClass( this.plugin_jqtabs.class_tabActive );
		var jqContent = jqTab[ 0 ]._jqtabs_jqContent;
		jqContent.addClass( this.plugin_jqtabs.class_contentActive );
		this._callEvents( "cbChange", jqTab, jqContent );
	},
	_desactiveTab: function() {
		if ( this.jqActiveTab[ 0 ] ) {
			this.jqActiveTab.removeClass( this.plugin_jqtabs.class_tabActive );
			this.jqActiveTab[ 0 ]._jqtabs_jqContent.removeClass( this.plugin_jqtabs.class_contentActive );
		}
	},
	_clickTab: function( jqTab ) {
		if (jqTab[ 0 ] && ( this.jqActiveTab === null || jqTab[ 0 ] !== this.jqActiveTab[ 0 ] ) ) {
			if ( this.jqActiveTab ) {
				this._desactiveTab();
			}
			this._activeTab( jqTab );
		}
	},
	_onDrag: function( jqTab ) {
		jqTab[ 0 ]._jqtabs_jqContent.detach();
		this._findTabs();
		var jqNewTabActive = this.getTabs().eq( 0 );
		if ( jqNewTabActive[ 0 ] ) {
			this._activeTab( jqNewTabActive );
		} else {
			this.jqActiveTab = null;
		}
	},
	_onDrop: function( jqTab ) {
		this._findTabs();
		if ( this.jqActiveTab ) {
			this._desactiveTab();
		}
		this.jqContents.append( jqTab[ 0 ]._jqtabs_jqContent );
		this._activeTab( jqTab );
	}
};
