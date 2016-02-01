<?php
use Cake\Core\Configure;

$config['HybridAuth'] = [
	'providers' => [
		'Twitter' => [
			'enabled' => true,
			'keys' => [
				'key' => '74wNa5NCQ4FbVHX8LaGDTSXxO',
				'secret' => '9FxtPOBDIajRL3iozGnOJUNjZT3qTOLilTELDmmVD58YfyVrI6',
			]
		],
	],
	'debug_mode' => Configure::read('debug'),
	'debug_file' => LOGS . 'hybridauth.log',
	'proxy' => '127.0.0.1:3213',
];