<?php
namespace App\Controller\Admin;

use App\Controller\AppController;
use Cake\Event\Event;
use Cake\Network\Exception\NotFoundException;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController
{

    /* * * * * * * * * * * * * *
     * [public] - properties   *
     * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * * * * * *
     * [protected] - member variables  *
     * * * * * * * * * * * * * * * * * */

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
    }

    /**
     * beforeFilter hook method
     *
     * @param Cake\Event\Event $event
     * @return void
     */
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
    }

    /* * * * * * * * * * * * * * * * * * *
     * [protected override] - methods    *
     * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * * * * * *
     * [public] - non-action methods   *
     * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * *
     * [public] - actions    *
     * * * * * * * * * * * * */

    /**
     * Index action (Dashboard)
     *
     * @return void
     */
    public function index()
    {
    }

    /* * * * * * * * * * * * * * * * * * *
     * [public] - actions for AJAX call  *
     * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * *
     * [protected] - methods   *
     * * * * * * * * * * * * * */
}
