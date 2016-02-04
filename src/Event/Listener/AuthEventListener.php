<?php
namespace App\Event\Listener;

use Cake\Event\EventListenerInterface;
use Cake\Event\Event;
use Cake\ORM\TableRegistry;

class AuthEventListener implements EventListenerInterface
{
	/**
     * implementedEvents override method
     *
     * @return array
     */
    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterLogin',
        ];
    }

    /**
     * afterLogin event handler
     *
     * @param \Cake\Event\Event $event
     * @return void
     */
    public function afterLogin(Event $event)
    {
        $user = $event->data[0];
        $Users = TableRegistry::get('Users');
        $userEntity = $Users->get($user['id']);
        $Users->touch($userEntity, 'Controller.Users.afterLogin');
        $Users->save($userEntity);
    }
}