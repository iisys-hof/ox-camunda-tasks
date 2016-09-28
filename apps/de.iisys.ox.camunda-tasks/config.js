/**
 * This work is provided under the terms of the CREATIVE COMMONS PUBLIC
 * LICENSE. This work is protected by copyright and/or other applicable
 * law. Any use of the work other than as authorized under this license
 * or copyright law is prohibited.
 *
 * http://creativecommons.org/licenses/by-nc-sa/2.5/
 *
 * © 2016 Institute of Information Systems, Hof, Germany.
 *
 * @author Christian Ochsenkühn <christian.ochsenkuehn@iisys.de>
 */
 
define('de.iisys.ox.camunda-tasks/config', [

], function () {

	var config = {
		'CAMUNDA_URL': 'https://broton.sc-hub.de/engine-rest',
		'LIFERAY_URL': 'https://broton.sc-hub.de',
//	    'CAMUNDA_URL': 'https://10.90.43.52:8448/engine-rest',
		'USE_DUMMY_TASKS': true
	};

	return config;
});