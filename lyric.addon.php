<?php
    if(!defined("__ZBXE__")) exit();

    /**
     * @file lyric.addon.php
     * @author Huhani (mmia268@gmail.com)
     * @brief 알송 가사 출력 애드온
     **/


	if($called_position == 'before_module_init' && Context::get('act') == 'getMP3FileLyric'){
		require_once('lyric.api.php');
		$document_srl = Context::get('document_srl');

		$oDocumentModel = getModel('document');
		$document_srl = Context::get('document_srl');
		$oDocument = $oDocumentModel->getDocument($document_srl);

//debugPrint(Context::getResponseMethod());
		$file = $oDocument->getUploadedFiles();
		$result = 'null';
		foreach($file as $val){
			if(substr($val->uploaded_filename, -4) === '.mp3'){
				$lyric = new Lyric($val->uploaded_filename);
				$hash = $lyric->getMD5Hash();
				$result = $lyric->getLyric($hash);
				if($result) {
					break;
				}
			}

		}

		echo $result;
		exit();

	}
	else if($called_position == 'after_module_proc' && Context::getResponseMethod()!="XMLRPC") {
		$document_srl = Context::get('document_srl');
		if($document_srl){

			$oTemplate = &TemplateHandler::getInstance();
			$output = $oTemplate->compile('./addons/lyric/tpl','lyric');
			Context::addHtmlFooter(sprintf("%s", $output));

			Context::addJsFile('./addons/lyric/tpl/lyric.js');
			Context::addJsFile('./addons/lyric/tpl/audio.js');
			Context::addCSSFile('./addons/lyric/tpl/lyric.css');
		}
	}

?>
