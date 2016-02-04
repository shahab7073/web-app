<?php
use Phinx\Seed\AbstractSeed;

/**
 * Roles seed.
 */
class RolesSeed extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     *
     * @return void
     */
    public function run()
    {
        $data = [[
                'id' => 1,
                'name' => 'User',
                'description' => 'Basic authenticated user',
                'alias' => 'user',
            ], [
                'id' => 2,
                'name' => 'Admin',
                'description' => 'Administrator',
                'alias' => 'admin',
            ]
        ];

        $table = $this->table('roles');
        $table->insert($data)->save();
    }
}
