var ArtistList = function() {
	"use strict";
	var self = SearchList($id("lists_artists_items"), $id("lists_artists_scrollbar"), $id("lists_artists_stretcher"), "name", "name_searchable");
	var loading = false;
	self.list_name = "all_artists";
	self.load_from_api = function() {
		if (!self.loaded && !loading) {
			loading = true;
			API.async_get("all_artists");
		}
	}
	self.tab_el = $el("li", { "textContent": $l("Artists"), "class": "link" });
	self.tab_el.addEventListener("click", function() {
		self.load_from_api();
		PlaylistLists.change_visible_list(self);
	});
	if (!MOBILE) API.add_callback(self.update, "all_artists");

	self.draw_entry = function(item) {
		item._el = document.createElement("div");
		item._el.className = "searchlist_item";
		item._el_text_span = document.createElement("span");
		item._el_text_span.className = "searchlist_name";
		item._el_text_span.textContent = item.name;
		item._el_text_span._id = item.id;
		item._el.appendChild(item._el_text_span);
	};

	self.update_item_element = function(item) {
		// this has no need
	};

	self.open_id = function(id) {
		DetailView.open_artist(id);
	};

	return self;
};