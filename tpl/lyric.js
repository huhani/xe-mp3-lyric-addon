(function($){

	$(document).ready(function(){

		var audio = $('div.xe_content audio');
		var multimedia = $("div.xe_content img[multimedia_src*='.mp3']");
		var audio_count = audio.length + multimedia.length;
		var document_srl = $('.xe_content[class*=document_]').attr('class') && $('.xe_content[class*=document_]').attr('class').replace(/.*document_([0-9]+).*/,'$1');
		var msg = '<div class="lyric_before" style="text-align: center;">가사 로딩중</div>';
		if(audio_count == 1){ //일단 1개까지만. 시간있으면 여러개 있을때도 동작하게 하자.

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
					if(html.error == -1) alert(html.message);
					if(html != '' && html != 'null') {
						$('.player_lyrics').html(html);
						$('.0000.ms-00').remove();

						var url = $('.lyric_file').text();
						var url_length = url.length;
						var src;
						var md5 = url.substring(url_length-36, url_length-4);

						var audio = $('div.xe_content audio');
						if(!audio.length) { //멀티미디어 확장 컴포넌트가 비활성화일시
							audio = $("div.xe_content img[multimedia_src*='.mp3']");
							src = audio.attr('multimedia_src');
						} else {
							src = audio.find('source').length ? audio.find('source').attr('src') : audio.attr('src');
						}

						var src_length = src.length;
						var src_md5 = src.substring(src_length-36, src_length-4);
						if(src && md5 === src_md5){

							audio.replaceWith("<center style='margin: 0 0 15px 0'><div class='lyrics'><div class='print_lyrics'></div></div><audio preload=\"\"></audio><br/></center>");

							setting.title = $('.lyric_title').text();
							setting.artist = $('.lyric_artist').text();

							$('.lyric_title, .lyric_artist, .lyric_file').remove();
							$('.print_lyrics').show().html('<p>'+setting.artist+' - '+setting.title+'</p><p>[간주중]</p>');

							var a = audiojs.createAll({
								trackEnded: function() {
									$('.print_lyrics').html('<p>'+setting.artist+' - '+setting.title+'</p><p>[간주중]</p>');
									return false;
								}
							});

							var audio = a[0];
							audio.load(src);
							audio.play();

						}
					}
				}

			});


		}

	});

})(jQuery);
