(function($){

	$(document).ready(function(){

		var audio = $('div.xe_content audio');
		var audio_count = audio.length;
		var document_srl = location.href.getQuery('document_srl');
		if(audio_count == 1){ //일단 1개까지만. 시간있으면 여러개 있을때도 동작하게 하자.
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

							audio.replaceWith("<center style='margin: 0 0 15px 0'><div class='lyrics'><div class='print_lyrics'></div></div><audio preload=\"\"></audio><br/></center>");

							$('.player_lyrics').html(html);
							$('.0000.ms-00').remove();

							setting.title = $('.lyric_title').text();
							setting.artist = $('.lyric_artist').text();
							$('.print_lyrics').show().html('<p>'+setting.title+' - '+setting.artist+'</p><p>[간주중]</p>');

							var a = audiojs.createAll({
								trackEnded: function() {
									$('.print_lyrics').html('<p>'+setting.title+' - '+setting.artist+'</p><p>[간주중]</p>');
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
