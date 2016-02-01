<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link      http://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */
namespace App\Controller;

use Cake\Controller\Controller;
use Cake\Event\Event;
use Cake\Utility\Inflector;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link http://book.cakephp.org/3.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{

    /* * * * * * * * * * * * * *
     * [public] - properties   *
     * * * * * * * * * * * * * */

    public $components = ['RequestHandler', 'Flash', 'Auth'];

    /* * * * * * * * * * * * * * * * * *
     * [protected] - member variables  *
     * * * * * * * * * * * * * * * * * */

    protected $_publicActions = [
        'Pages' => ['display'],
        'Users' => ['add'],
    ];

    /* * * * * * * * * * * * * * * * *
     * [public override] - methods   *
     * * * * * * * * * * * * * * * * */

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();

        $this->_loadComponents();

        $this->Auth->config([
            'authenticate' => [
                'Form',
                'ADmad/HybridAuth.HybridAuth' => [
                    'registrationCallback' => 'addFromSnsProvider',
                    'hauth_return_to' => [
                        'controller' => 'Users',
                        'action' => 'afterSnsLogin'
                    ],
                ],
            ],
            // 'authorize' => ['Controller'],
            'loginRedirect' => [
                'plugin' => false,
                'controller' => 'Pages',
                'action' => 'display',
                'test'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'test'
            ]
        ]);
    }

    /**
     * AppController::beforeFilter()
     *
     * @return void
     */
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);

        // Allow public actions with no authentication.
        $controllerName = $this->request->params['controller'];
        if (array_key_exists($controllerName, $this->_publicActions)) {
            $this->Auth->allow($this->_publicActions[$controllerName]);
        }
    }

    /**
     * Before render callback.
     *
     * @param \Cake\Event\Event $event The beforeRender event.
     * @return void
     */
    public function beforeRender(Event $event)
    {
        if (!array_key_exists('_serialize', $this->viewVars) &&
            in_array($this->response->type(), ['application/json', 'application/xml'])
        ) {
            $this->set('_serialize', true);
        }

        // Use different layout for signed in members.
        // if ($this->Auth->user()) {
        //     $this->viewBuilder()->layout('members');
        // }

        $page_id = Inflector::dasherize($this->request->params['controller'] . '-' . $this->request->params['action']);
        $this->set(compact('page_id'));
    }

    /**
     * isAuthorized hook method
     *
     * @param array $user
     * @return boolean
     */
    // public function isAuthorized($user)
    // {
    //     // Default deny
    //     return false;
    // }

    /* * * * * * * * * * * * * * * * * * *
     * [protected override] - methods    *
     * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * *
     * [public] - actions    *
     * * * * * * * * * * * * */

    /* * * * * * * * * * * * * * * * * * *
     * [public] - actions for AJAX call  *
     * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * *
     * [protected] - methods   *
     * * * * * * * * * * * * * */
}
