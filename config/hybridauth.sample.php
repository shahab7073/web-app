<?php
use Cake\Core\Configure;

$config['HybridAuth'] = [
	'providers' => [
		'Twitter' => [
			'enabled' => true,
			'keys' => [
				'key' => 'YOUR_KEY_HERE',
				'secret' => 'YOUR_SECRET_HERE',
			]
		],
	],
	'debug_mode' => Configure::read('debug'),
	'debug_file' => LOGS . 'hybridauth.log',
	// 'proxy' => 'address:port',
];