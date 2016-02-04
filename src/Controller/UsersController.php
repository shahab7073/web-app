<?php
namespace App\Controller;

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
     * Login action
     *
     * @return void
     */
    public function login()
    {
        if ($this->Auth->user()) {
            return $this->redirect($this->Auth->redirectUrl());
        }

        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            $data = $this->request->data;
            if ($user) {
                $this->Auth->setUser($user);
                if ($data['remember_me']) {
                    $this->Cookie->write('CookieAuth', [
                        'username' => $data['username'],
                        'password' => $data['password']
                    ]);
                }
                $this->_setWelcomeToast($user['first_name'], $user['username']);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error(__('Invalid username or password, try again.'));
        }
    }

    /**
     * Logout action
     *
     * @return Cake\Network\Response|null
     */
    public function logout()
    {
        $user = $this->Auth->user();
        $name = trim($user['first_name']);
        if (empty($name)) {
            $name = trim($user['username']);
        }
        $this->Flash->toast(__("Goodbye, {$name}!"));

        $this->request->session()->delete('afterSnsLoginCalled');
        return $this->redirect($this->Auth->logout());
    }

    /**
     * Action for SNS login post processing.
     * This is called by HybridAuth plugin after successful SNS login.
     *
     * @return void Redirects to $this->Auth->redirectUrl()
     */
    public function afterSnsLogin()
    {
        if ($this->request->session()->check('afterSnsLoginCalled')) {
            throw new NotFoundException();
        }

        $user = $this->Auth->user();
        $isNewbie = !$user['last_login'];
        $this->_setWelcomeToast($user['first_name'], $user['username'], $isNewbie);

        // For security
        $this->request->session()->write('afterSnsLoginCalled', true);

        return $this->redirect($this->Auth->redirectUrl());
    }

    /**
     * Add action (Sign Up / Registration)
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        if ($this->Auth->user()) {
            return $this->redirect($this->Auth->redirectUrl());
        }

        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $data = $this->request->data;

            // Check if user tries SNS sign up
            if (empty($data['provider']) === false) {
                $this->Auth->identify();
                return;
            }

            $user = $this->Users->patchEntity($user, $data);
            $this->Users->touch($user, 'Controller.Users.afterLogin');

            if ($this->Users->save($user)) {
                $this->Auth->setUser($user->toArray());
                $this->_setWelcomeToast($user->first_name, $user->username, true);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__("We couldn't complete your registration. Please, try again."));
            }
        }
        $this->set(compact('user'));
    }

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

    /**
     * _setWelcomeToast method
     *
     * @param string $name
     * @param string $nameAlt = "Guest"
     * @param boolean $isNewbie = false
     * @return void
     */
    protected function _setWelcomeToast($name, $nameAlt = "Guest", $isNewbie = false)
    {
        $greetingName = trim($name);
        if (empty($greetingName)) {
            $greetingName = trim($nameAlt);
        }
        $phrase = $isNewbie ? "Welcome to CoolOps" : "Welcome back";
        $this->Flash->toast(__("{$phrase}, {$greetingName}!"));
    }
}
