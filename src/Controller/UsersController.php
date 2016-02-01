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
            if ($user) {
                $this->Auth->setUser($user);
                $greetingName = trim($user['first_name']);
                if (empty($greetingName)) {
                    $greetingName = $user['username'];
                }
                $this->Flash->toast(__("Welcome back, {$greetingName}!"));
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
        $userEntity = $this->Users->get($user['id']);
        $this->Users->touch($userEntity, 'Controller.Users.afterLogin');
        $this->Users->save($userEntity);

        $greetingName = trim($user['first_name']);
        if (empty($greetingName)) {
            $greetingName = $user['username'];
        }
        $this->Flash->toast(__("Welcome back, {$greetingName}!"));

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
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {
                $this->Flash->success(__("You've successfully signed up."));
                $this->Auth->setUser($user->toArray());
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__("We couldn't complete your registration. Please, try again."));
            }
        }
        $this->set(compact('user'));
    }

    /* * * * * * * * * * * * * * * * * * *
     * [public] - actions for AJAX call  *
     * * * * * * * * * * * * * * * * * * */

    /* * * * * * * * * * * * * *
     * [protected] - methods   *
     * * * * * * * * * * * * * */
}
