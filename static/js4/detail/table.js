var SongsTable = function(songs, columns) {
	"use strict";
	var el = $el("table", { "class": "songlist" });

	var row, cell, r, i, div;
	for (i = 0; i < songs.length; i++) {
		row = $el("tr");
		if (("cool" in songs[i]) && songs[i].cool) {
			row.className = "songlist_cool";
		}

		var requestable = false;
		if (("origin_sid" in songs[i]) && (songs[i].origin_sid == User.sid)) requestable = true;
		if (("sid" in songs[i]) && (songs[i].sid == User.sid)) requestable = true;
		if (("requestable" in songs[i]) && (songs[i].requestable)) requestable = true;

		if (requestable) {
			cell = $el("td", { "class": "songlist_requestable" });
			cell.appendChild($el("img", { "src": "/static/images4/request.png" }));
			if (!Prefs.get("request_made")) {
				cell.textContent = $l("Request");
				cell.addEventListener("click", function() {
					Prefs.change("request_made", true);
				});
			}
			row.appendChild(cell);
			Requests.make_clickable(cell, songs[i].id);

		}
		else {
			row.appendChild($el("td", { "class": "songlist_not_requestable" }));
		}

		if (songs[i].url) {
			cell = $el("td", { "class": "songlist_url" },
						$el("a", { "href": songs[i].url, "target": "_blank" },
							$el("img", { "src": "/static/images4/link_window.png" })));
			row.appendChild(cell);
		}
		else {
			row.appendChild($el("td", { "class": "songlist_url" }));
		}

		for (var key = 0; key < columns.length; key++) {
			if ((columns[key] == "artists") && ("artist_parseable" in songs[i])) {
				cell = row.appendChild($el("td", { "class": "songlist_" + columns[key] }));
				div = $el("div", { "class": "songlist_" + columns[key] + "_text" });
				Artists.append_spans_from_string(div, songs[i].artist_parseable);
				Formatting.add_overflow_tooltip(div);
				cell.appendChild(div);
			}
			else if (columns[key] in songs[i]) {
				if (columns[key] == "title") {
					cell = row.appendChild($el("td", { "class": "songlist_" + columns[key] } ));
					div = $el("div", { "class": "songlist_" + columns[key] + "_text", "textContent": songs[i][columns[key]] });
					Formatting.add_overflow_tooltip(div);
					cell.appendChild(div);
				}
				else if (columns[key] == "rating") {
					cell = $el("td", { "class": "songlist_" + columns[key] });
					r = Rating("song", songs[i].id, songs[i].rating_user, songs[i].rating, songs[i].fave, User.rate_anything);
					r.absolute_x = true;
					r.absolute_y = true;
					cell.appendChild(r.el);
					row.appendChild(cell);
				}
				else if (columns[key] == "cool_end") {
					if (songs[i].cool_end > Clock.now) {
						row.appendChild($el("td", { "class": "songlist_" + columns[key], "textContent": Formatting.cooldown_glance(songs[i].cool_end - Clock.now) } ));
					}
					else {
						row.appendChild($el("td", { "class": "songlist_" + columns[key] }));
					}
				}
				else if (columns[key] == "length") {
					row.appendChild($el("td", { "class": "songlist_" + columns[key], "textContent": Formatting.minute_clock(songs[i].length) }));
				}
				else {
					row.appendChild($el("td", { "class": "songlist_" + columns[key], "textContent": songs[i][columns[key]] } ));
				}
			}
		}

		el.appendChild(row);
	}
	return el;
};