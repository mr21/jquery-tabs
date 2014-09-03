/*
	jQuery - tabs - 1.0
	https://github.com/Mr21/jquery-tabs
*/

$.plugin_tabs = function(parent, options) {
	return new $.plugin_tabs.obj(
		parent.jquery
			? parent.eq(0)
			: $(parent),
		options || {}
	);
};

$.plugin_tabs.obj = function(jq_parent, options) {
	this.class_container     = options.class_container     || 'jqtabs';
	this.class_tabs          = options.class_tabs          || 'jqtabs-tabs';
	this.class_tab           = options.class_tab           || 'jqtabs-tab';
	this.class_tabActive     = options.class_tabActive     || 'jqtabs-tabActive';
	this.class_tabHole       = options.class_tabHole       || 'jqtabs-tabHole';
	this.class_contents      = options.class_contents      || 'jqtabs-contents';
	this.class_content       = options.class_content       || 'jqtabs-content';
	this.class_contentActive = options.class_contentActive || 'jqtabs-contentActive';
	this.jq_parent = jq_parent;
	this.container = [];
	this.applyThis(options.applyThis);
	this.onChange(options.onChange);

	if (!options.noDragndrop && $.plugin_dragndrop)
		this._dragndropInit();
	this._watchDom();
	this._initContainer(jq_parent);
};

$.plugin_tabs.obj.prototype = {
	// public:
	dragndrop: function() { return this.plugin_dragndrop; },
	applyThis: function(app) {
		if (app !== undefined)
			return this.app = app, this;
		return this.app;
	},
	onChange: function(cb) { this.cbChange = cb; return this; },
	// private:
	_initContainer: function(jq_elem) {
		var self = this;
		if (!jq_elem.hasClass('.' + this.class_container))
			jq_elem = jq_elem.find('.' + this.class_container);
		jq_elem.each(function() {
			var	jq_this = $(this),
				obj = new $.plugin_tabs.container(jq_this, self);
			if (this.id)
				self.container[this.id] = obj;
			else
				self.container.push(obj);
		});
	},
	_watchDom: function() {
		var self = this;
		this.jq_parent.on('DOMNodeInserted', function(e) {
			self._initContainer($(e.target));
		});
	},
	_dragndropInit: function() {
		this.plugin_dragndrop =
			$.plugin_dragndrop(this.jq_parent, {
				dropClass     : this.class_tabs,
				dragClass     : this.class_tab,
				dragHoleClass : this.class_tabHole,
				noSelection   : true
			})
			.onDrag(function(jq_drops, jq_tabs) {
				jq_drops[0]._jqtabs_container._onDrag(jq_tabs);
			})
			.onDrop(function(jq_drops, jq_tabs) {
				var container = jq_drops[0]._jqtabs_container;
				jq_tabs[0]._jqtabs_container = container;
				container._onDrop(jq_tabs);
			});
	}
};

$.plugin_tabs.container = function(jq_parent, plugin_jqtabs) {
	this.jq_tabActive = null;
	this.jq_parent = jq_parent;
	this.plugin_jqtabs = plugin_jqtabs;
	this.jq_tabs = this.jq_parent.find('.' + plugin_jqtabs.class_tabs);
	this.jq_contents = this.jq_parent.find('.' + plugin_jqtabs.class_contents);
	this.jq_tabs[0]._jqtabs_container = this;
	this._init();
};

$.plugin_tabs.container.prototype = {
	// public:
	getTabs: function() {
		return this.jq_tabs.children('.' + this.plugin_jqtabs.class_tab);
	},
	prevTab: function() {
		this._clickTab(this.jq_tabActive.prevAll('.' + this.plugin_jqtabs.class_tab).eq(0));
	},
	nextTab: function() {
		this._clickTab(this.jq_tabActive.nextAll('.' + this.plugin_jqtabs.class_tab).eq(0));
	},
	// private:
	_init: function() {
		var	self = this,
			jq_tabs = this.getTabs(),
			jq_contents = this.jq_contents.children('.' + this.plugin_jqtabs.class_content);
		jq_tabs.each(function(i) {
			var jq_tab = jq_tabs.eq(i);
			this._jqtabs_container = self;
			this._jqtabs_jqContent = jq_contents.eq(i);
			if (jq_tab.hasClass(self.plugin_jqtabs.class_tabActive)) {
				self._activeTab(jq_tab);
			}
			jq_tab.mousedown(function(e) {
				if (e.button === 0)
					this._jqtabs_container._clickTab(jq_tab);
			});
		});
		if (!this.jq_tabActive)
			this._activeTab(jq_tabs.eq(0));
	},
	_activeTab: function(jq_tab) {
		this.jq_tabActive = jq_tab.addClass(this.plugin_jqtabs.class_tabActive);
		jq_tab[0]._jqtabs_isActive = true;
		jq_tab[0]._jqtabs_jqContent.addClass(this.plugin_jqtabs.class_contentActive);
		if (this.plugin_jqtabs.cbChange)
			this.plugin_jqtabs.cbChange(jq_tab, jq_tab[0]._jqtabs_jqContent);
	},
	_desactiveTab: function() {
		if (this.jq_tabActive[0]) {
			this.jq_tabActive.removeClass(this.plugin_jqtabs.class_tabActive)[0]._jqtabs_isActive = false;
			this.jq_tabActive[0]._jqtabs_jqContent.removeClass(this.plugin_jqtabs.class_contentActive);
		}
	},
	_clickTab: function(jq_tab) {
		if (jq_tab[0] && !jq_tab[0]._jqtabs_isActive) {
			this._desactiveTab();
			this._activeTab(jq_tab);
		}
	},
	_zindex: function() {
		this.getTabs().each(function() {
			
		});
	},
	_onDrag: function(jq_tab) {
		jq_tab[0]._jqtabs_jqContent.detach();
		var jq_newTabActive = this.getTabs().eq(0);
		if (jq_newTabActive[0])
			this._activeTab(jq_newTabActive);
		else
			this.jq_tabActive = null;
	},
	_onDrop: function(jq_tab) {
		if (this.jq_tabActive)
			this._desactiveTab();
		this.jq_contents.append(jq_tab[0]._jqtabs_jqContent);
		this._activeTab(jq_tab);
		this._zindex();
	}
};
