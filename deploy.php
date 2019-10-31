<?php

namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'Crossword');

// Apache user
set('http_user', 'apache');

// Project repository
set('repository', 'git@github.com:studio24/Crossword.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Shared files/dirs between deploys
// set('shared_files', ['config/wp-config.local.php']);
// set('shared_dirs', ['web/wp-content/uploads','.well-known','web/wp-content/cache']);

// Writable dirs by web server
// set('writable_dirs', ['web/wp-content/uploads','web/wp-content/cache']);
// set('allow_anonymous_stats', false);

// Custom
set('keep_releases', 20);

// Hosts

host('production')
    ->hostname('63.34.69.8')
    ->user('deploy')
    ->set('deploy_path','/data/var/www/vhosts/crossword.studio24.net/production');

// Tasks

desc('Deploy Crossword');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
//    'deploy:shared',
//    'deploy:writable',
//    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');



