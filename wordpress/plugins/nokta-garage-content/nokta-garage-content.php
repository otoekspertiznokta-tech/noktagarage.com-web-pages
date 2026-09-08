<?php
/**
 * Plugin Name: Nokta Garage İçerik Yönetimi
 * Description: Nokta Garage statik sitesinin içerik tiplerini, public build API'sini ve Cloudflare yayın tetikleyicisini sağlar.
 * Version: 2.0.0
 * Requires at least: 6.7
 * Requires PHP: 8.1
 * Author: Nokta Garage
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NG_CONTENT_VERSION', '2.0.0');
define('NG_CONTENT_FILE', __FILE__);

require_once __DIR__ . '/includes/class-nokta-garage-content.php';
require_once __DIR__ . '/includes/class-nokta-garage-seeder.php';

register_activation_hook(__FILE__, ['Nokta_Garage_Seeder', 'activate']);
Nokta_Garage_Content::boot();
