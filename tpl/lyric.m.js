function updt(a){var b=a;null!=setting.lyric_setInterval&&clearInterval(setting.lyric_setInterval),setting.lyric_setInterval=setInterval(function(){b.paused&&clearInterval(setting.lyric_setInterval),m=Math.floor(b.currentTime/60),s=Math.floor(b.currentTime%60),ms=parseInt(100*((b.currentTime%60).toFixed(2)-s)),time=(m<10?"0":"")+m+(s<10?"0":"")+s;var a=jQuery(".player_lyrics ."+time);if(a.length>0){for(var d=(parseInt(a.attr("class").split("ms-")[1]),[]),e=0;e<a.length;e++){var f=jQuery(a[e]).attr("class").split("ms-")[1];jQuery.inArray(f,d)==-1&&d.push(f)}for(var e=0;e<d.length;e++)if(d[e]-ms>-10&&d[e]-ms<10){var g=jQuery(".player_lyrics ."+time+".ms-"+d[e]);if(1===jQuery(g).length){var h=g.next().attr("class"),i=g.prev().attr("class");if(!h&&i){i=i.replace(" ","."),showLyric(g,null,jQuery("."+i));break}if(h&&!i){h=h.replace(" ","."),showLyric(g,jQuery("."+h),!0,!0);break}if(!h&&!i){showLyric(g);break}h&&i&&(h=h.replace(" ","."),i=i.replace(" ","."),showLyric(g,jQuery("."+h),jQuery("."+i)))}else showLyric(g,null,null);break}}},40)}function showLyric(a,b,c,d){html="";var e=a.length;if(1===e)if(0===(1&a.index())){if(html+="<p>",html+=""==a.html()?"<BR>":a.html(),html+="</p>",b&&c){var f=a.attr("class"),g=parseInt(f.substring(0,2)),h=parseInt(f.substring(2,4)),i=parseInt(f.substring(8,10)),j=b.attr("class"),k=parseInt(j.substring(0,2)),l=parseInt(j.substring(2,4)),m=parseInt(j.substring(8,10)),n=k+":"+l+"."+m;if(n==setting.last_lyric)return;if(setting.last_lyric=n,d===!0)html+='<p style="color:#AAA;font-weight: normal;">'+(""==b.html()?"<BR>":b.html())+"</p>",null!==setting.next_lyric&&clearTimeout(setting.next_lyric),setting.next_lyric=null;else{var o=10*(100*(l+60*(k-g)-h)+m-i);html+='<p style="color:#AAA;font-weight: normal;">',html+=""==c.html()?"<BR>":c.html(),html+="</p>",null===setting.next_lyric&&(setting.next_lyric=setTimeout(function(){jQuery(".print_lyrics p").eq(1).html(""==b.html()?"<BR>":b.html()),setting.next_lyric=null},o/3))}}}else{if(b){var f=a.attr("class"),g=parseInt(f.substring(0,2)),h=parseInt(f.substring(2,4)),i=parseInt(f.substring(8,10)),j=b.attr("class"),k=parseInt(j.substring(0,2)),l=parseInt(j.substring(2,4)),m=parseInt(j.substring(8,10)),n=k+":"+l+"."+m;if(n==setting.last_lyric)return;if(setting.last_lyric=n,d===!0)html+='<p style="color:#AAA;font-weight: normal;">'+(""==b.html()?"<BR>":b.html())+"</p>",null!==setting.next_lyric&&clearTimeout(setting.next_lyric),setting.next_lyric=null;else{var o=10*(100*(l+60*(k-g)-h)+m-i);null===setting.next_lyric&&(setting.next_lyric=setTimeout(function(){jQuery(".print_lyrics p").eq(0).html(""==b.html()?"<BR>":b.html()),setting.next_lyric=null},o/3)),html+='<p style="color:#AAA;font-weight: normal;">'+(""==c.html()?"<BR>":c.html())+"</p>"}}html+="<p>"+(""==a.html()?"<BR>":a.html())+"</p>"}else for(var p=0;p<e;p++)html+="<p>"+a.eq(p).html().replace(/ /gi,"&nbsp;")+"</p>";jQuery(".print_lyrics").html(html)}

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
		var audio_count = audio.length;
		var document_srl = location.href.getQuery('document_srl');
		if(audio_count == 1){
			$.ajax({
				type:"POST",
				data: {
					act: 'getMP3FileLyric',
					document_srl: document_srl
				},

				success: function(html) {
					if(html.error == -1) alert(html.message);
					if(html != '' && html != 'null') {
						var audio = $('div.xe_content audio');
						var src = audio.find('source').length ? audio.find('source').attr('src') : audio.attr('src');
						if(src){

							audio.before("<center><div class='lyrics'><div class='print_lyrics' style='margin:7px 0 12px 0;'></div></div></center>");
							audio.wrap("<center></center>");
							audio.attr('ontimeupdate', 'updt(this)');

							$('.player_lyrics').html(html);
							$('.0000.ms-00').remove();

							setting.title = $('.lyric_title').text();
							setting.artist = $('.lyric_artist').text();
							$('.lyric_title, .lyric_artist').remove();
							$('.print_lyrics').show().html('<p>'+setting.artist+' - '+setting.title+'</p><p>[간주중]</p>');

						}
					}
				}

			});


		}

	});

})(jQuery);
