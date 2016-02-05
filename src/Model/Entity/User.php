<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;
use Cake\Auth\DefaultPasswordHasher;

/**
 * User Entity.
 *
 * @property int $id
 * @property string $email
 * @property string $username
 * @property string $password
 * @property string $first_name
 * @property string $last_name
 * @property string $provider
 * @property string $provider_uid
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \Cake\I18n\Time $last_login
 * @property int $role_id
 * @property string $avatar
 * @property string $avatar_dir
 */
class User extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false,
    ];

    protected $_hidden = ['password'];

    /* * * * * * * * * * * * *
     * [properties setter]   *
     * * * * * * * * * * * * */

    /**
     * Set password
     *
     * @param string $password
     * @return string
     */
    protected function _setPassword($password) {
        return (new DefaultPasswordHasher)->hash($password);
    }

    /* * * * * * * * * * * * *
     * [virtual properties]  *
     * * * * * * * * * * * * */

    /**
     * Get full_name
     *
     * @return string
     */
    protected function _getFullName()
    {
        return $this->_properties['first_name'] . ' ' . $this->_properties['last_name'];
    }

    /**
     * Get avatar_url_tiny
     *
     * @return string
     */
    protected function _getAvatarUrlTiny()
    {
        return empty($this->_properties['avatar']) ? 
                'tiny_default_avatar.jpg'
                : '../upload/users/avatar/' . $this->_properties['avatar_dir'] . '/tiny_' . $this->_properties['avatar'];
    }

    /**
     * Get avatar_url_small
     *
     * @return string
     */
    protected function _getAvatarUrlSmall()
    {
        return empty($this->_properties['avatar']) ? 
                'small_default_avatar.jpg'
                : '../upload/users/avatar/' . $this->_properties['avatar_dir'] . '/small_' . $this->_properties['avatar'];
    }

    /**
     * Get avatar_url_medium
     *
     * @return string
     */
    protected function _getAvatarUrlMedium()
    {
        return empty($this->_properties['avatar']) ? 
                'medium_default_avatar.jpg'
                : '../upload/users/avatar/' . $this->_properties['avatar_dir'] . '/medium_' . $this->_properties['avatar'];
    }
}
