<!-- <?php
// Redis Configuration
$redis_host = getenv("REDIS_HOST") ?: "127.0.0.1";
$redis_port = getenv("REDIS_PORT") ?: 6379;
$redis_password = getenv("REDIS_PASSWORD") ?: "";

$redis = null;

if (class_exists('Redis')) {
    try {
        $redis = new Redis();
        if ($redis->connect($redis_host, (int)$redis_port)) {
            if (!empty($redis_password)) {
                $redis->auth($redis_password);
            }
        } else {
            $redis = null;
        }
    } catch (Exception $e) {
        $redis = null;
    }
}
?> -->
