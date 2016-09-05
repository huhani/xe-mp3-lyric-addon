function updateLyric(a) {
	var b = a;
	null != setting.lyric_setInterval && clearInterval(setting.lyric_setInterval), setting.lyric_setInterval = setInterval(function() {
		b.paused && clearInterval(setting.lyric_setInterval), m = Math.floor(b.currentTime / 60), s = Math.floor(b.currentTime % 60), ms = parseInt(100 * ((b.currentTime % 60).toFixed(2) - s)), time = (m < 10 ? "0" : "") + m + (s < 10 ? "0" : "") + s;
		var a = jQuery(".player_lyrics ." + time);
		if (a.length > 0) {
			for (var d = (parseInt(a.attr("class").split("ms-")[1]), []), e = 0; e < a.length; e++) {
				var f = jQuery(a[e]).attr("class").split("ms-")[1];
				jQuery.inArray(f, d) == -1 && d.push(f)
			}
			for (var e = 0; e < d.length; e++)
				if (d[e] - ms > -10 && d[e] - ms < 10) {
					var g = jQuery(".player_lyrics ." + time + ".ms-" + d[e]);
					if (1 === jQuery(g).length) {
						var h = g.next().attr("class"),
							i = g.prev().attr("class");
						if (!h && i) {
							i = i.replace(" ", "."), showLyric(g, null, jQuery("." + i));
							break
						}
						if (h && !i) {
							h = h.replace(" ", "."), showLyric(g, jQuery("." + h), !0, !0);
							break
						}
						if (!h && !i) {
							showLyric(g);
							break
						}
						h && i && (h = h.replace(" ", "."), i = i.replace(" ", "."), showLyric(g, jQuery("." + h), jQuery("." + i)))
					} else showLyric(g, null, null);
					break
				}
		}
	}, 40)
}

function showLyric(a, b, c, d) {
	html = "";
	var e = a.length;
	if (1 === e)
		if (0 === (1 & a.index())) {
			if (html += "<p>", html += "" == a.html() ? "<BR>" : a.html(), html += "</p>", b && c) {
				var f = a.attr("class"),
					g = parseInt(f.substring(0, 2)),
					h = parseInt(f.substring(2, 4)),
					i = parseInt(f.substring(8, 10)),
					j = b.attr("class"),
					k = parseInt(j.substring(0, 2)),
					l = parseInt(j.substring(2, 4)),
					m = parseInt(j.substring(8, 10)),
					n = k + ":" + l + "." + m;
				if (n == setting.last_lyric) return;
				if (setting.last_lyric = n, d === !0) html += '<p style="color:#AAA;font-weight: normal;">' + ("" == b.html() ? "<BR>" : b.html()) + "</p>", null !== setting.next_lyric && clearTimeout(setting.next_lyric), setting.next_lyric = null;
				else {
					var o = 10 * (100 * (l + 60 * (k - g) - h) + m - i);
					html += '<p style="color:#AAA;font-weight: normal;">', html += "" == c.html() ? "<BR>" : c.html(), html += "</p>", null === setting.next_lyric && (setting.next_lyric = setTimeout(function() {
						jQuery(".print_lyrics p").eq(1).html("" == b.html() ? "<BR>" : b.html()), setting.next_lyric = null
					}, o / 3))
				}
			}
		} else {
			if (b) {
				var f = a.attr("class"),
					g = parseInt(f.substring(0, 2)),
					h = parseInt(f.substring(2, 4)),
					i = parseInt(f.substring(8, 10)),
					j = b.attr("class"),
					k = parseInt(j.substring(0, 2)),
					l = parseInt(j.substring(2, 4)),
					m = parseInt(j.substring(8, 10)),
					n = k + ":" + l + "." + m;
				if (n == setting.last_lyric) return;
				if (setting.last_lyric = n, d === !0) html += '<p style="color:#AAA;font-weight: normal;">' + ("" == b.html() ? "<BR>" : b.html()) + "</p>", null !== setting.next_lyric && clearTimeout(setting.next_lyric), setting.next_lyric = null;
				else {
					var o = 10 * (100 * (l + 60 * (k - g) - h) + m - i);
					null === setting.next_lyric && (setting.next_lyric = setTimeout(function() {
						jQuery(".print_lyrics p").eq(0).html("" == b.html() ? "<BR>" : b.html()), setting.next_lyric = null
					}, o / 3)), html += '<p style="color:#AAA;font-weight: normal;">' + ("" == c.html() ? "<BR>" : c.html()) + "</p>"
				}
			}
			html += "<p>" + ("" == a.html() ? "<BR>" : a.html()) + "</p>"
		}
	else
		for (var p = 0; p < e; p++) html += "<p>" + a.eq(p).html().replace(/ /gi, "&nbsp;") + "</p>";
	jQuery(".print_lyrics").html(html)
}

var setting = {
	title: null,
	artist: null,

	lyric_setInterval : null,
	next_lyric: null,
	last_lyric: null,
	tmp_lyrics: null
};


(function($){

	$(document).ready(function(){

		var audio = $('div.xe_content audio');
		var multimedia = $("div.xe_content img[multimedia_src*='.mp3']");
		var audio_count = audio.length + multimedia.length;
		var document_srl = $('.xe_content[class*=document_]').attr('class') && $('.xe_content[class*=document_]').attr('class').replace(/.*document_([0-9]+).*/,'$1');
		var msg = '<div class="lyric_before" style="text-align: center;">가사 로딩중</div>';
		if(audio_count == 1){

			if(!audio.length){
				multimedia.before(msg);
			} else {
				audio.before(msg);
			}

			$.ajax({
				type:"POST",
				data: {
					act: 'getMP3FileLyric',
					mid: current_mid,
					document_srl: document_srl
				},

				success: function(html) {
					$('.lyric_before').remove();
					if(html.error == -1) {
						return alert(html.message);
					}
					if(html != '' && html != 'null') {
						$('.player_lyrics').html(html);
						$('.0000.ms-00').remove();

						var url = $('.lyric_file').text();
						var url_length = url.length;
						var src;
						var md5 = url.substring(url_length-36, url_length-4);

						var audio = $('div.xe_content audio');
						var is_audio = false;
						if(!audio.length) { //멀티미디어 확장 컴포넌트가 비활성화일시
							audio = $("div.xe_content img[multimedia_src*='.mp3']");
							src = audio.attr('multimedia_src');
						} else {
							src = audio.find('source').length ? audio.find('source').attr('src') : audio.attr('src');
							is_audio = true;
						}

						var src_length = src.length;
						var src_md5 = src.substring(src_length-36, src_length-4);
						if(src && md5 === src_md5){

							if(!is_audio){

								audio.replaceWith("<center style='margin: 0 0 15px 0'><div class='lyrics'><div class='print_lyrics'></div></div><audio src=\""+src+"\" preload=\"meta\" loop=\"loop\" controls=\"\"></audio><br/></center>");

							} else {

								audio.before("<center><div class='lyrics'><div class='print_lyrics' style='margin:7px 0 12px 0;'></div></div></center>");
								audio.wrap("<center></center>");
							}
							audio.bind('timeupdate', function () {
							    updateLyric(this);
							});

							$('.player_lyrics').html(html);
							$('.0000.ms-00').remove();

							setting.title = $('.lyric_title').text();
							setting.artist = $('.lyric_artist').text();
							$('.lyric_title, .lyric_artist, .lyric_file').remove();
							$('.print_lyrics').show().html('<p>'+setting.artist+' - '+setting.title+'</p><p>[간주중]</p>');

						}
					}
				}

			});


		}

	});

})(jQuery);
