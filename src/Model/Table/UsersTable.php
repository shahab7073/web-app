<?php
namespace App\Model\Table;

use App\Model\Entity\User;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Users Model
 *
 */
class UsersTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('users');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp', [
            'events' => [
                'Model.beforeSave' => [
                    'created' => 'new',
                    'modified' => 'always',
                ],
                'Controller.Users.afterLogin' => [
                    'last_login' => 'always',
                ]
            ]
        ]);

        $this->addBehavior('Proffer.Proffer', [
            'avatar' => [
                'root' => WWW_ROOT . 'upload',
                'dir' => 'avatar_dir',
                'thumbnailSizes' => [
                    'tiny' => [
                        'w' => 42,
                        'h' => 42,
                        'crop' => false,
                        'jpeg_quality' => 100,
                        'png_compression_level' => 9
                    ],
                    'small' => [
                        'w' => 80,
                        'h' => 80,
                        'crop' => false,
                        'jpeg_quality' => 100,
                        'png_compression_level' => 9
                    ],
                    'medium' => [
                        'w' => 150,
                        'h' => 150,
                        'crop' => false,
                        'jpeg_quality' => 100,
                        'png_compression_level' => 9
                    ]
                ]
            ]
        ]);

        $this->belongsTo('Roles');
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator->provider('proffer', 'Proffer\Model\Validation\ProfferRules');

        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
            ->add('email', 'valid', ['rule' => 'email'])
            ->requirePresence('email', 'create')
            ->notEmpty('email')
            ->add('email', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
            ->requirePresence('username', 'create')
            ->notEmpty('username')
            ->add('username', 'unique', ['rule' => 'validateUnique', 'provider' => 'table']);

        $validator
            ->requirePresence('password', 'create')
            ->notEmpty('password');

        $validator
            ->requirePresence('first_name', 'create')
            ->notEmpty('first_name');

        $validator
            ->requirePresence('last_name', 'create')
            ->notEmpty('last_name');

        $validator
            ->add('avatar', 'proffer', [
                'rule' => ['dimensions', [
                    'min' => ['w' => 32, 'h' => 32],
                    'max' => ['w' => 1024, 'h' => 1024]
                ]],
                'message' => 'Avatar image is not in correct dimensions.',
                'provider' => 'proffer'
            ])
            ->allowEmpty('avatar');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->isUnique(['email']));
        $rules->add($rules->isUnique(['username']));
        return $rules;
    }

    /**
     * Add user from SNS provider authentication
     *
     * @param string $provider
     * @param object $providerProfile Hybrid_User_Profile instance
     */
    public function addFromSnsProvider($provider, $providerProfile)
    {
        $pp = $providerProfile;
        $user = $this->newEntity();

        $roles = $this->Roles
            ->find('list', [
                'keyField' => 'alias',
                'valueField' => 'id',
            ])
            ->toArray();

        $fields = [
            'password' => '',
            'provider' => $provider,
            'provider_uid' => $pp->identifier,
            'role_id' => $roles['user'],
        ];

        if ($provider === 'Twitter') {
            $fields += [
                'email' => $pp->email ?? '',
                'username' => $pp->displayName ?? '',
                'first_name' => $pp->firstName ?? '',
                'last_name' => $pp->lastName ?? '',
                'provider_avatar' => $pp->photoURL ?? '',
            ];
        }
        $user->set($fields);

        return $this->save($user);
    }
}
