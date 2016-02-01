<?php
use Migrations\AbstractMigration;

class Initial extends AbstractMigration
{
    public function up()
    {
        $table = $this->table('users');
        $table
            ->addColumn('email', 'string', [
                'default' => null,
                'limit' => 200,
                'null' => false,
            ])
            ->addColumn('username', 'string', [
                'default' => null,
                'limit' => 200,
                'null' => false,
            ])
            ->addColumn('password', 'string', [
                'default' => null,
                'limit' => 200,
                'null' => false,
            ])
            ->addColumn('first_name', 'string', [
                'default' => null,
                'limit' => 200,
                'null' => false,
            ])
            ->addColumn('last_name', 'string', [
                'default' => null,
                'limit' => 200,
                'null' => false,
            ])
            ->addColumn('provider', 'string', [
                'default' => null,
                'limit' => 100,
                'null' => false,
            ])
            ->addColumn('provider_uid', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ])
            ->addColumn('created', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addColumn('modified', 'datetime', [
                'default' => null,
                'limit' => null,
                'null' => true,
            ])
            ->addIndex(
                [
                    'email',
                ],
                ['unique' => true]
            )
            ->addIndex(
                [
                    'username',
                ],
                ['unique' => true]
            )
            ->create();

    }

    public function down()
    {
        $this->dropTable('users');
    }
}
