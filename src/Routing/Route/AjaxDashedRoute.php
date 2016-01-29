<?php
namespace App\Routing\Route;

use Cake\Routing\Route\Route;
use Cake\Utility\Inflector;

class AjaxDashedRoute extends Route
{

    /* * * * * * * * * * * * * * * * *
     * [public override] - methods   *
     * * * * * * * * * * * * * * * * */

    /**
     * parse method
     *
     * @param string $url
     * @return array|false
     */
	public function parse($url)
    {
        $params = parent::parse($url);
        if (!$params) {
            return false;
        }
        if (!empty($params['controller'])) {
            $params['controller'] = Inflector::camelize(str_replace(
                '-',
                '_',
                $params['controller']
            ));
        }
        if (!empty($params['plugin'])) {
            $params['plugin'] = Inflector::camelize(str_replace(
                '-',
                '_',
                $params['plugin']
            ));
        }
        if (!empty($params['action'])) {
            $params['action'] = Inflector::variable(str_replace(
                '-',
                '_',
                'ajax-' . $params['action']
            ));
        }
        return $params;
    }

    /**
     * match method
     *
     * @param array $url
     * @param array $context
     * @return boolean|string
     */
	public function match(array $url, array $context = [])
    {
        if (preg_match("/^ajax.+/", $url['action']) == 0) {
        	return false;
        }
        $url['action'] = preg_replace("/^ajax(.+)/", '$1', $url['action']);
        $url = $this->_dasherize($url);
        return parent::match($url, $context);
    }

    /* * * * * * * * * * * * * *
     * [protected] - methods   *
     * * * * * * * * * * * * * */

    /**
     * Helper method for dasherizing keys in a URL array.
     *
     * @param array $url An array of URL keys.
     * @return array
     */
    protected function _dasherize($url)
    {
        foreach (['controller', 'plugin', 'action'] as $element) {
            if (!empty($url[$element])) {
                $url[$element] = Inflector::dasherize($url[$element]);
            }
        }
        return $url;
    }

}