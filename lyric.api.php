<?php

require_once('packages/HttpClient.class.php');

class Lyric {

	protected $filename;
	public function __construct($filename) {
		$this->filename = $filename;
	}
 
	public function getMD5Hash() {
		$fd = fopen($this->filename, "rb");
 
		$block = fread($fd, 100);
		$offset = $this->skipID3v2Tag($block);
		fseek($fd, $offset, SEEK_SET);
		return md5(fread($fd, 163840));
	}


	public function getLyric($md5){

		$string = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ns2="ALSongWebServer/Service1Soap" xmlns:ns1="ALSongWebServer" xmlns:ns3="ALSongWebServer/Service1Soap12"><SOAP-ENV:Body><ns1:GetLyric5><ns1:stQuery><ns1:strChecksum>'.$md5.'</ns1:strChecksum><ns1:strVersion>2.0 beta2</ns1:strVersion><ns1:strMACAddress>ffffffffffff</ns1:strMACAddress><ns1:strIPAddress>255.255.255.0</ns1:strIPAddress></ns1:stQuery></ns1:GetLyric5></SOAP-ENV:Body></SOAP-ENV:Envelope>';

		$client = new HttpClient('lyrics.alsong.co.kr');
		$client->post('/alsongwebservice/service1.asmx', $string);

		$content = $client->getContent();

		preg_match('|<strTitle>(.*)</strTitle><strArtist>(.*)</strArtist>|U', $content, $lyric);

		preg_match('/<strLyric>(.*)?<\/strLyric>/i', $content, $lrc);

			$lrc = $lrc[0];
			if(!$lrc) return false;

			$lrc = str_replace('&lt;br&gt;','<br>',$lrc);
			$lrc = str_replace('<strLyric>','',$lrc);
			$lrc = str_replace('</strLyric>','',$lrc);

			$result = preg_replace("/\[([\d]{2}):([\d]{2}).([\d]{2})\](.*?)<br>/", '<div class="$1$2 ms-$3">$4</div>', $lrc);
			$result .= '<div class="lyric_title">'.$lyric[1].'</div><div class="lyric_artist">'.$lyric[2].'</div>';
			if($this->filename) $result .= '<div class="lyric_file">'.$this->filename.'</div>';
			return $result;


	}

	private function skipID3v2Tag(&$block) {
		if (substr($block, 0,3)=="ID3") {
			$id3v2_flags = ord($block[5]);
			$flag_footer_present = $id3v2_flags & 0x10 ? 1 : 0;
			$z0 = ord($block[6]);
			$z1 = ord($block[7]);
			$z2 = ord($block[8]);
			$z3 = ord($block[9]);
			if ( (($z0&0x80)==0) && (($z1&0x80)==0) && (($z2&0x80)==0) && (($z3&0x80)==0) ) {
				$header_size = 10;
				$tag_size = (($z0&0x7f) * 2097152) + (($z1&0x7f) * 16384) + (($z2&0x7f) * 128) + ($z3&0x7f);
				$footer_size = $flag_footer_present ? 10 : 0;
				return $header_size + $tag_size + $footer_size;
			}
		}
		return 0;
	}


}
