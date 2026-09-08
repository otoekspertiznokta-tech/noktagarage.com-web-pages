<?php

if (!defined('ABSPATH')) {
    exit;
}

final class Nokta_Garage_Content
{
    private const DATA_VERSION = 2;

    private const POST_TYPES = [
        'ng_package' => ['Paketler', 'Paket', 'dashicons-clipboard'],
        'ng_service' => ['Hizmetler', 'Hizmet', 'dashicons-admin-tools'],
        'ng_campaign' => ['Kampanyalar', 'Kampanya', 'dashicons-megaphone'],
        'ng_gallery' => ['Galeri', 'Galeri Görseli', 'dashicons-format-gallery'],
        'ng_branch' => ['İşletme Bilgileri', 'İşletme Bilgisi', 'dashicons-location-alt'],
        'ng_home' => ['Ana Sayfa', 'Ana Sayfa', 'dashicons-admin-home'],
    ];

    private const ICONS = [
        'wrench', 'search', 'car', 'paint', 'scan', 'box', 'gauge', 'brake',
        'suspension', 'alignment', 'interior', 'light', 'tire', 'airbag',
        'building',
    ];

    private static bool $deploy_on_shutdown = false;

    public static function boot(): void
    {
        add_action('init', [self::class, 'register_content_types']);
        add_action('init', [self::class, 'maybe_migrate'], 20);
        add_action('add_meta_boxes', [self::class, 'register_meta_boxes']);
        add_action('save_post', [self::class, 'save_fields'], 10, 2);
        add_action('save_post', [self::class, 'schedule_deploy_for_post'], 99, 2);
        add_action('transition_post_status', [self::class, 'schedule_deploy_for_status'], 10, 3);
        add_action('before_delete_post', [self::class, 'schedule_deploy_for_delete'], 10, 2);
        add_action('admin_enqueue_scripts', [self::class, 'enqueue_admin_assets']);
        add_action('admin_menu', [self::class, 'register_settings_page']);
        add_action('admin_init', [self::class, 'register_settings']);
        add_action('rest_api_init', [self::class, 'register_rest_routes']);
        add_action('shutdown', [self::class, 'send_deploy_hook']);
        add_action('template_redirect', [self::class, 'redirect_public_frontend']);
        add_filter('wp_robots', [self::class, 'force_noindex']);
        add_filter('wp_sitemaps_enabled', '__return_false');
        add_action('update_option_ng_site_settings', [self::class, 'schedule_deploy_for_settings'], 10, 2);
    }

    public static function register_content_types(): void
    {
        foreach (self::POST_TYPES as $type => [$plural, $single, $icon]) {
            $supports = match ($type) {
                'ng_service' => ['title', 'editor'],
                'ng_campaign' => ['title', 'editor', 'thumbnail'],
                'ng_gallery', 'ng_home' => ['title', 'thumbnail'],
                default => ['title'],
            };
            $singleton = in_array($type, ['ng_branch', 'ng_home'], true);
            register_post_type($type, [
                'labels' => [
                    'name' => $plural,
                    'singular_name' => $single,
                    'add_new_item' => "Yeni {$single} Ekle",
                    'edit_item' => "{$single} Düzenle",
                    'not_found' => "{$single} bulunamadı",
                ],
                'public' => false,
                'show_ui' => true,
                'show_in_menu' => true,
                'show_in_rest' => false,
                'menu_icon' => $icon,
                'supports' => $supports,
                'map_meta_cap' => true,
                'capabilities' => $singleton ? ['create_posts' => 'do_not_allow'] : [],
            ]);
        }
        register_post_type('ng_page', [
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => false,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
        ]);
        add_post_type_support('post', 'thumbnail');
    }

    public static function maybe_migrate(): void
    {
        if ((int) get_option('ng_content_data_version', 1) >= self::DATA_VERSION) return;

        $services = get_posts(['post_type' => 'ng_service', 'post_status' => 'any', 'numberposts' => -1]);
        $service_ids_by_name = [];
        foreach ($services as $service) {
            $service_ids_by_name[sanitize_title($service->post_title)] = $service->ID;
        }

        $packages = get_posts(['post_type' => 'ng_package', 'post_status' => 'any', 'numberposts' => -1]);
        foreach ($packages as $package) {
            if (metadata_exists('post', $package->ID, '_ng_service_ids')) continue;
            $legacy_names = preg_split('/\R/', (string) get_post_meta($package->ID, '_ng_services', true));
            $ids = [];
            foreach ($legacy_names ?: [] as $name) {
                $key = sanitize_title(trim($name));
                if ($key !== '' && isset($service_ids_by_name[$key])) $ids[] = $service_ids_by_name[$key];
            }
            update_post_meta($package->ID, '_ng_service_ids', array_values(array_unique($ids)));
        }

        foreach (['ng_package', 'ng_service', 'ng_campaign', 'ng_gallery', 'ng_branch'] as $type) {
            $records = get_posts(['post_type' => $type, 'post_status' => 'publish', 'numberposts' => -1]);
            foreach ($records as $record) {
                if ((string) get_post_meta($record->ID, '_ng_active', true) === '0') {
                    wp_update_post(['ID' => $record->ID, 'post_status' => 'draft']);
                }
            }
        }

        $home_records = get_posts(['post_type' => 'ng_home', 'post_status' => 'any', 'numberposts' => 1]);
        if (!$home_records) {
            $legacy_home = get_posts(['post_type' => 'ng_page', 'name' => 'home', 'post_status' => 'any', 'numberposts' => 1]);
            $home_id = wp_insert_post([
                'post_type' => 'ng_home', 'post_status' => 'publish', 'post_title' => 'Ana Sayfa', 'post_name' => 'home',
            ]);
            if (!is_wp_error($home_id) && $legacy_home) {
                update_post_meta($home_id, '_ng_image_id', get_post_meta($legacy_home[0]->ID, '_ng_image_id', true));
            }
        }

        $branches = get_posts(['post_type' => 'ng_branch', 'post_status' => 'any', 'numberposts' => 1]);
        if ($branches && !metadata_exists('post', $branches[0]->ID, '_ng_default_whatsapp_message')) {
            $settings = wp_parse_args(get_option('ng_site_settings', []), Nokta_Garage_Seeder::default_settings());
            update_post_meta($branches[0]->ID, '_ng_default_whatsapp_message', $settings['defaultWhatsappMessage']);
        }

        update_option('ng_content_data_version', self::DATA_VERSION, false);
    }

    public static function register_meta_boxes(): void
    {
        foreach (array_keys(self::POST_TYPES) as $type) {
            add_meta_box('ng_content_fields', 'Site Alanları', [self::class, 'render_fields'], $type, 'normal', 'high');
        }
        add_meta_box('ng_blog_fields', 'Nokta Garage Blog Alanları', [self::class, 'render_fields'], 'post', 'normal', 'high');
    }

    private static function definitions(string $type): array
    {
        return match ($type) {
            'ng_package' => [
                ['order', 'Sıra', 'number'],
                ['price', 'Fiyat (örn. 2.500 TL)', 'text'],
                ['service_ids', 'Pakete dahil hizmetler', 'services'],
            ],
            'ng_service' => [
                ['order', 'Sıra', 'number'],
                ['category', 'Kategori', 'text'],
                ['icon', 'İkon anahtarı', 'select', self::ICONS],
            ],
            'ng_campaign' => [
                ['order', 'Sıra', 'number'],
                ['image_id', 'Görsel', 'media'],
                ['summary', 'Kısa açıklama', 'textarea'],
                ['starts_at', 'Başlangıç tarihi', 'date'],
                ['ends_at', 'Bitiş tarihi', 'date'],
                ['cta_label', 'Detay sayfası aksiyon yazısı', 'text'],
                ['cta_href', 'Detay sayfası aksiyon adresi', 'link'],
                ['whatsapp_message', 'WhatsApp hazır mesajı', 'textarea'],
            ],
            'ng_gallery' => [
                ['order', 'Sıra', 'number'],
                ['image_id', 'Görsel', 'media'],
                ['image_alt', 'Alternatif metin', 'text'],
                ['caption', 'Açıklama', 'text'],
            ],
            'ng_branch' => [
                ['city', 'İl', 'text'], ['district', 'İlçe', 'text'],
                ['address', 'Açık adres', 'textarea'], ['short_address', 'Kısa adres', 'text'],
                ['phone', 'Telefon', 'text'],
                ['whatsapp', 'WhatsApp bağlantısı', 'url'], ['email', 'E-posta', 'email'],
                ['maps_url', 'Google Maps bağlantısı', 'url'],
                ['working_hours', 'Çalışma saatleri', 'text'],
                ['default_whatsapp_message', 'Genel WhatsApp hazır mesajı', 'textarea'],
            ],
            'ng_home' => [['image_id', 'Ana sayfa hero görseli', 'media']],
            'post' => [
                ['blog_category', 'Site blog kategorisi', 'select', [
                    'Araç Alım Rehberi', 'Ekspertiz Bilgileri', 'Bakım ve Teknik Bilgiler', "Nokta Garage'dan",
                ]],
                ['blog_intro', 'Yazı giriş paragrafı', 'textarea'],
                ['cover_alt', 'Kapak görseli alternatif metni', 'text'],
                ['seo_title', 'SEO başlığı', 'text'], ['seo_description', 'SEO açıklaması', 'textarea'],
            ],
            default => [],
        };
    }

    public static function render_fields(WP_Post $post): void
    {
        wp_nonce_field('ng_save_content', 'ng_content_nonce');
        echo '<table class="form-table"><tbody>';
        foreach (self::definitions($post->post_type) as $definition) {
            [$key, $label, $type] = $definition;
            $options = $definition[3] ?? [];
            $value = get_post_meta($post->ID, '_ng_' . $key, true);
            echo '<tr><th scope="row"><label for="ng_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
            self::render_control($key, $type, $value, $options ?? []);
            echo '</td></tr>';
        }
        echo '</tbody></table>';
    }

    private static function render_control(string $key, string $type, mixed $value, array $options): void
    {
        $name = 'ng_' . $key;
        if ($type === 'services') {
            $selected = is_array($value) ? array_map('absint', $value) : [];
            $services = get_posts([
                'post_type' => 'ng_service', 'post_status' => ['publish', 'draft'], 'numberposts' => -1,
                'orderby' => ['meta_value_num' => 'ASC', 'title' => 'ASC'], 'meta_key' => '_ng_order',
            ]);
            echo '<fieldset class="ng-service-picker">';
            foreach ($services as $service) {
                echo '<label style="display:block;margin:.45rem 0"><input type="checkbox" name="' . esc_attr($name) . '[]" value="' . esc_attr((string) $service->ID) . '" ' . checked(in_array($service->ID, $selected, true), true, false) . '> ' . esc_html($service->post_title) . ($service->post_status !== 'publish' ? ' — Taslak' : '') . '</label>';
            }
            echo '</fieldset>';
            return;
        }
        if ($type === 'textarea' || $type === 'json') {
            echo '<textarea class="large-text' . ($type === 'json' ? ' code' : '') . '" rows="' . ($type === 'json' ? '8' : '4') . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">' . esc_textarea((string) $value) . '</textarea>';
            return;
        }
        if ($type === 'select') {
            echo '<select id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">';
            foreach ($options as $option) echo '<option value="' . esc_attr($option) . '" ' . selected((string) $value, $option, false) . '>' . esc_html($option) . '</option>';
            echo '</select>';
            return;
        }
        if ($type === 'media') {
            $preview = $value ? wp_get_attachment_image((int) $value, 'thumbnail') : '';
            echo '<div class="ng-media-field"><input type="hidden" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr((string) $value) . '"><div class="ng-media-preview">' . wp_kses_post($preview) . '</div><button type="button" class="button ng-select-media">Görsel seç</button> <button type="button" class="button-link-delete ng-remove-media">Kaldır</button></div>';
            return;
        }
        echo '<input class="regular-text" type="' . esc_attr($type) . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr((string) $value) . '">';
    }

    public static function save_fields(int $post_id, WP_Post $post): void
    {
        if (!isset($_POST['ng_content_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ng_content_nonce'])), 'ng_save_content')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        foreach (self::definitions($post->post_type) as [$key, , $type]) {
            $field = 'ng_' . $key;
            if ($type === 'services') {
                $ids = isset($_POST[$field]) && is_array($_POST[$field])
                    ? array_values(array_unique(array_filter(array_map('absint', wp_unslash($_POST[$field])))))
                    : [];
                update_post_meta($post_id, '_ng_' . $key, $ids);
                continue;
            }
            if (!isset($_POST[$field])) continue;
            $raw = wp_unslash($_POST[$field]);
            $value = match ($type) {
                'textarea' => sanitize_textarea_field($raw),
                'json' => self::sanitize_json($raw),
                'url' => esc_url_raw($raw),
                'link' => self::sanitize_link($raw),
                'email' => sanitize_email($raw),
                'number', 'media' => (string) absint($raw),
                default => sanitize_text_field($raw),
            };
            update_post_meta($post_id, '_ng_' . $key, $value);
        }
    }

    private static function sanitize_json(string $raw): string
    {
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) return '{}';
        return wp_json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    private static function sanitize_link(string $raw): string
    {
        $value = trim($raw);
        if ($value === '') return '';
        if (str_starts_with($value, '/') && !str_starts_with($value, '//')) return sanitize_text_field($value);
        return esc_url_raw($value, ['https', 'tel', 'mailto']);
    }

    public static function enqueue_admin_assets(string $hook): void
    {
        if (!in_array($hook, ['post.php', 'post-new.php'], true)) return;
        wp_enqueue_media();
        wp_enqueue_script('ng-content-admin', plugins_url('assets/admin.js', NG_CONTENT_FILE), ['jquery'], NG_CONTENT_VERSION, true);
    }

    public static function register_settings_page(): void
    {
        add_options_page('Nokta Garage Site Ayarları', 'Nokta Garage', 'manage_options', 'nokta-garage-settings', [self::class, 'render_settings_page']);
    }

    public static function register_settings(): void
    {
        register_setting('ng_site_settings_group', 'ng_site_settings', ['sanitize_callback' => [self::class, 'sanitize_settings']]);
    }

    public static function sanitize_settings(array $input): array
    {
        $result = get_option('ng_site_settings', []);
        $result = is_array($result) ? $result : [];
        $result['deployHookUrl'] = isset($input['deployHookUrl']) ? esc_url_raw($input['deployHookUrl']) : '';
        return $result;
    }

    public static function render_settings_page(): void
    {
        if (!current_user_can('manage_options')) return;
        $settings = wp_parse_args(get_option('ng_site_settings', []), Nokta_Garage_Seeder::default_settings());
        echo '<div class="wrap"><h1>Nokta Garage Yayın Ayarları</h1><p>İşletme bilgileri, ilgili menüdeki tek kayıttan yönetilir. Buradaki gizli adres yalnız Cloudflare Pages yayınını tetiklemek için kullanılır.</p><form method="post" action="options.php">';
        settings_fields('ng_site_settings_group');
        echo '<table class="form-table"><tbody>';
        echo '<tr><th><label for="ng_setting_deployHookUrl">Cloudflare Pages Deploy Hook (gizli)</label></th><td><input class="large-text" type="password" autocomplete="off" id="ng_setting_deployHookUrl" name="ng_site_settings[deployHookUrl]" value="' . esc_attr($settings['deployHookUrl'] ?? '') . '"></td></tr>';
        echo '</tbody></table>';
        submit_button('Ayarları Kaydet ve Siteyi Güncelle');
        echo '</form></div>';
    }

    public static function register_rest_routes(): void
    {
        register_rest_route('nokta-garage/v1', '/content', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [self::class, 'get_content_bundle'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('nokta-garage/v2', '/content', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [self::class, 'get_content_bundle_v2'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function get_content_bundle(): WP_REST_Response
    {
        $bundle = [];
        $mapping = [
            'packages' => 'ng_package', 'services' => 'ng_service', 'campaigns' => 'ng_campaign',
            'gallery' => 'ng_gallery', 'branches' => 'ng_branch', 'pages' => 'ng_page',
        ];
        foreach ($mapping as $key => $type) {
            $bundle[$key] = self::records_for_type($type);
        }
        $bundle['blogPosts'] = self::records_for_type('post');
        $bundle['settings'] = [
            'id' => 0, 'slug' => 'site-settings', 'status' => 'publish',
            'modified_gmt' => gmdate('c'), 'acf' => self::public_settings(),
        ];
        $response = new WP_REST_Response($bundle, 200);
        $response->header('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
        $response->header('X-Robots-Tag', 'noindex, nofollow');
        return $response;
    }

    public static function get_content_bundle_v2(): WP_REST_Response
    {
        $bundle = [
            'packages' => self::records_for_type_v2('ng_package'),
            'services' => self::records_for_type_v2('ng_service'),
            'campaigns' => self::records_for_type_v2('ng_campaign'),
            'gallery' => self::records_for_type_v2('ng_gallery'),
            'blogPosts' => self::records_for_type_v2('post'),
            'branch' => self::single_record_v2('ng_branch'),
            'home' => self::single_record_v2('ng_home'),
        ];
        $response = new WP_REST_Response($bundle, 200);
        $response->header('Cache-Control', 'no-store, max-age=0');
        $response->header('X-Robots-Tag', 'noindex, nofollow');
        return $response;
    }

    private static function single_record_v2(string $type): ?array
    {
        $records = self::records_for_type_v2($type);
        return count($records) === 1 ? $records[0] : null;
    }

    private static function records_for_type_v2(string $type): array
    {
        $query = [
            'post_type' => $type, 'post_status' => 'publish', 'numberposts' => -1,
            'orderby' => ['meta_value_num' => 'ASC', 'date' => 'DESC'], 'meta_key' => '_ng_order',
            'suppress_filters' => false,
        ];
        if (in_array($type, ['ng_branch', 'ng_home'], true)) {
            unset($query['meta_key']);
            $query['orderby'] = ['date' => 'DESC'];
        }
        if ($type === 'post') {
            unset($query['meta_key']);
            $query['orderby'] = ['date' => 'DESC'];
            $query['meta_query'] = [['key' => '_ng_blog_category', 'compare' => 'EXISTS']];
        }
        return array_map([self::class, 'record_fields_v2'], get_posts($query));
    }

    private static function record_fields_v2(WP_Post $post): array
    {
        $meta = fn(string $key, string $default = ''): string => (string) (get_post_meta($post->ID, '_ng_' . $key, true) ?: $default);
        $image = fn(): ?string => ($id = absint($meta('image_id'))) ? (wp_get_attachment_image_url($id, 'full') ?: null) : null;
        $order = absint($meta('order'));

        return match ($post->post_type) {
            'ng_package' => [
                'slug' => $post->post_name, 'name' => get_the_title($post), 'price' => $meta('price'),
                'serviceSlugs' => self::service_slugs(get_post_meta($post->ID, '_ng_service_ids', true)), 'order' => $order,
            ],
            'ng_service' => [
                'slug' => $post->post_name, 'name' => get_the_title($post), 'category' => $meta('category'),
                'description' => wp_strip_all_tags($post->post_content), 'icon' => $meta('icon', 'wrench'), 'order' => $order,
            ],
            'ng_campaign' => [
                'slug' => $post->post_name, 'title' => get_the_title($post), 'summary' => $meta('summary', $post->post_excerpt),
                'contentHtml' => self::safe_content_html($post->post_content),
                'contentText' => wp_strip_all_tags($post->post_content), 'image' => $image(),
                'startsAt' => $meta('starts_at'), 'endsAt' => $meta('ends_at'), 'order' => $order,
                'detailCta' => $meta('cta_href') ? ['label' => $meta('cta_label', 'Bilgi Al'), 'href' => $meta('cta_href')] : null,
                'whatsappMessage' => $meta('whatsapp_message') ?: null,
            ],
            'ng_gallery' => [
                'id' => $post->post_name, 'image' => $image(), 'alt' => $meta('image_alt', get_the_title($post)),
                'caption' => $meta('caption') ?: null, 'order' => $order,
            ],
            'ng_branch' => [
                'name' => get_the_title($post), 'city' => $meta('city'), 'district' => $meta('district'),
                'address' => $meta('address'), 'shortAddress' => $meta('short_address'), 'phone' => $meta('phone'),
                'phoneHref' => self::phone_href($meta('phone')), 'whatsapp' => $meta('whatsapp'), 'email' => $meta('email'),
                'mapsUrl' => $meta('maps_url'), 'workingHours' => $meta('working_hours'),
                'defaultWhatsappMessage' => $meta('default_whatsapp_message'),
            ],
            'ng_home' => ['heroImage' => $image()],
            'post' => [
                'slug' => $post->post_name, 'title' => get_the_title($post),
                'summary' => $post->post_excerpt ?: wp_trim_words(wp_strip_all_tags($post->post_content), 32),
                'category' => $meta('blog_category', "Nokta Garage'dan"),
                'publishedAt' => get_the_date('Y-m-d', $post), 'displayDate' => get_the_date('j F Y', $post),
                'coverImage' => get_the_post_thumbnail_url($post, 'full') ?: '/images/home-hero.webp',
                'coverAlt' => $meta('cover_alt', get_the_title($post)),
                'seoTitle' => $meta('seo_title', get_the_title($post) . ' | Nokta Garage'),
                'seoDescription' => $meta('seo_description', $post->post_excerpt),
                'intro' => $meta('blog_intro', $post->post_excerpt),
                'sections' => self::blog_sections($post->post_content),
                'contentHtml' => self::blog_content_html($post->post_content),
            ],
            default => [],
        };
    }

    private static function service_slugs(mixed $ids): array
    {
        if (!is_array($ids)) return [];
        $slugs = [];
        foreach (array_map('absint', $ids) as $id) {
            $service = get_post($id);
            if ($service instanceof WP_Post && $service->post_type === 'ng_service') $slugs[] = $service->post_name;
        }
        return array_values(array_unique($slugs));
    }

    private static function phone_href(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?: '';
        if (str_starts_with($digits, '0')) $digits = '90' . substr($digits, 1);
        if ($digits !== '' && !str_starts_with($digits, '90')) $digits = '90' . $digits;
        return $digits === '' ? '' : 'tel:+' . $digits;
    }

    private static function records_for_type(string $type): array
    {
        $query = [
            'post_type' => $type, 'post_status' => 'publish', 'numberposts' => -1,
            'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'], 'suppress_filters' => false,
        ];
        if ($type === 'post') $query['meta_query'] = [['key' => '_ng_blog_category', 'compare' => 'EXISTS']];
        $posts = get_posts($query);
        return array_map(fn(WP_Post $post) => [
            'id' => $post->ID, 'slug' => $post->post_name, 'status' => 'publish',
            'modified_gmt' => get_post_modified_time('c', true, $post),
            'acf' => self::record_fields($post),
        ], $posts);
    }

    private static function record_fields(WP_Post $post): array
    {
        $meta = fn(string $key, string $default = ''): string => (string) (get_post_meta($post->ID, '_ng_' . $key, true) ?: $default);
        $bool = fn(string $key, bool $default = false): bool => get_post_meta($post->ID, '_ng_' . $key, true) === '' ? $default : $meta($key) === '1';
        $image = fn(string $key = 'image_id'): string => ($id = absint($meta($key))) ? (wp_get_attachment_image_url($id, 'full') ?: '') : '';
        $seo = fn(): array => ['title' => $meta('seo_title', get_the_title($post)), 'description' => $meta('seo_description', wp_strip_all_tags($post->post_excerpt))];
        $order = absint($meta('order', (string) $post->menu_order));

        return match ($post->post_type) {
            'ng_package' => [
                'name' => get_the_title($post), 'slug' => $post->post_name, 'summary' => $meta('summary', $post->post_excerpt),
                'description' => wp_strip_all_tags($post->post_content), 'price' => $meta('price'),
                'previousPrice' => $meta('previous_price') ?: null, 'image' => $image() ?: null,
                'services' => array_values(array_filter(array_map('trim', preg_split('/\R/', $meta('services'))))),
                'featured' => $bool('featured'), 'active' => $bool('active', true), 'order' => $order,
                'cta' => ['label' => $meta('cta_label', 'Bilgi Al'), 'href' => $meta('cta_href', '/randevu')],
                'whatsappMessage' => $meta('whatsapp_message'), 'seo' => $seo(),
            ],
            'ng_service' => [
                'name' => get_the_title($post), 'slug' => $post->post_name, 'category' => $meta('category'),
                'summary' => $meta('summary', $post->post_excerpt), 'description' => wp_strip_all_tags($post->post_content),
                'icon' => $meta('icon', 'wrench'), 'image' => $image() ?: null,
                'active' => $bool('active', true), 'order' => $order, 'seo' => $seo(),
            ],
            'ng_campaign' => [
                'title' => get_the_title($post), 'slug' => $post->post_name,
                'summary' => $meta('summary', $post->post_excerpt), 'detail' => wp_strip_all_tags($post->post_content),
                'image' => $image() ?: null, 'startsAt' => $meta('starts_at'), 'endsAt' => $meta('ends_at'),
                'active' => $bool('active', true), 'order' => $order,
                'cta' => ['label' => $meta('cta_label', 'Bilgi Al'), 'href' => $meta('cta_href')],
                'whatsappMessage' => $meta('whatsapp_message'),
            ],
            'ng_gallery' => [
                'id' => $post->post_name, 'image' => $image() ?: null,
                'alt' => $meta('image_alt', get_the_title($post)), 'caption' => $meta('caption') ?: null,
                'placeholderLabel' => get_the_title($post), 'icon' => $meta('icon', 'building'),
                'order' => $order, 'active' => $bool('active', true),
            ],
            'ng_branch' => [
                'name' => get_the_title($post), 'slug' => $post->post_name, 'city' => $meta('city'),
                'district' => $meta('district'), 'address' => $meta('address'), 'shortAddress' => $meta('short_address'),
                'phone' => $meta('phone'), 'phoneHref' => $meta('phone_href'), 'whatsapp' => $meta('whatsapp'),
                'email' => $meta('email'), 'mapsUrl' => $meta('maps_url'), 'mapEmbedUrl' => $meta('map_embed_url') ?: null,
                'workingHours' => $meta('working_hours'), 'images' => [],
                'description' => wp_strip_all_tags($post->post_content), 'active' => $bool('active', true), 'seo' => $seo(),
            ],
            'ng_page' => [
                'slug' => $post->post_name, 'title' => get_the_title($post),
                'hero' => [
                    'eyebrow' => $meta('hero_eyebrow'), 'heading' => $meta('hero_heading'),
                    'description' => $meta('hero_description'), 'image' => $image() ?: null,
                    'primaryCta' => ['label' => $meta('primary_cta_label'), 'href' => $meta('primary_cta_href')],
                    'secondaryCta' => ['label' => $meta('secondary_cta_label'), 'href' => $meta('secondary_cta_href')],
                ],
                'sections' => self::decode_object($meta('sections_json')),
                'quickAccess' => self::decode_array($meta('quick_access_json')),
                'visibility' => self::decode_object($meta('visibility_json')), 'seo' => $seo(),
            ],
            'post' => [
                'slug' => $post->post_name, 'title' => get_the_title($post),
                'summary' => $post->post_excerpt ?: wp_trim_words(wp_strip_all_tags($post->post_content), 32),
                'category' => $meta('blog_category', "Nokta Garage'dan"),
                'publishedAt' => get_the_date('Y-m-d', $post), 'displayDate' => get_the_date('j F Y', $post),
                'coverImage' => get_the_post_thumbnail_url($post, 'full') ?: '/images/home-hero.webp',
                'coverAlt' => $meta('cover_alt', get_the_title($post)),
                'seoTitle' => $meta('seo_title', get_the_title($post) . ' | Nokta Garage'),
                'seoDescription' => $meta('seo_description', $post->post_excerpt),
                'intro' => $meta('blog_intro', $post->post_excerpt),
                'sections' => self::blog_sections($post->post_content),
                'contentHtml' => self::blog_content_html($post->post_content),
            ],
            default => [],
        };
    }

    private static function decode_object(string $json): array
    {
        $value = json_decode($json, true);
        return is_array($value) ? $value : [];
    }

    private static function decode_array(string $json): array
    {
        return array_values(self::decode_object($json));
    }

    private static function blog_sections(string $content): array
    {
        preg_match_all('/<h2[^>]*>(.*?)<\/h2>/is', $content, $matches);
        return array_map(fn(string $heading) => [
            'heading' => wp_strip_all_tags($heading), 'paragraphs' => [],
        ], $matches[1] ?? []);
    }

    private static function blog_content_html(string $content): string
    {
        $index = 0;
        $content = preg_replace_callback('/<h2([^>]*)>/i', static function (array $match) use (&$index): string {
            $index++;
            $attributes = preg_replace('/\s+id=("|\').*?\1/i', '', $match[1]);
            return '<h2' . $attributes . ' id="bolum-' . $index . '">';
        }, $content) ?? $content;
        return self::safe_content_html($content);
    }

    private static function safe_content_html(string $content): string
    {
        return wp_kses_post(apply_filters('the_content', $content));
    }

    private static function public_settings(): array
    {
        $settings = wp_parse_args(get_option('ng_site_settings', []), Nokta_Garage_Seeder::default_settings());
        unset($settings['deployHookUrl']);
        return [
            'brandName' => $settings['brandName'], 'brandDescriptor' => $settings['brandDescriptor'],
            'logo' => $settings['logo'], 'alternateLogo' => $settings['alternateLogo'], 'favicon' => $settings['favicon'],
            'primaryPhone' => $settings['primaryPhone'], 'phoneHref' => $settings['phoneHref'],
            'whatsappBaseUrl' => $settings['whatsappBaseUrl'], 'email' => $settings['email'], 'socialLinks' => [],
            'defaultWhatsappMessage' => $settings['defaultWhatsappMessage'], 'footerText' => $settings['footerText'],
            'copyright' => $settings['copyright'], 'mapsUrl' => $settings['mapsUrl'],
            'googleBusinessUrl' => $settings['googleBusinessUrl'], 'workingHours' => $settings['workingHours'],
            'defaultSeo' => ['title' => $settings['defaultSeoTitle'], 'description' => $settings['defaultSeoDescription']],
            'defaultSocialImage' => $settings['defaultSocialImage'],
            'navigation' => Nokta_Garage_Seeder::default_navigation(),
        ];
    }

    public static function schedule_deploy_for_post(int $post_id, WP_Post $post): void
    {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id) || $post->post_status !== 'publish') return;
        if ($post->post_type !== 'post' && !array_key_exists($post->post_type, self::POST_TYPES)) return;
        self::$deploy_on_shutdown = true;
    }

    public static function schedule_deploy_for_status(string $new_status, string $old_status, WP_Post $post): void
    {
        if ($new_status === $old_status || ($new_status !== 'publish' && $old_status !== 'publish')) return;
        if ($post->post_type !== 'post' && !array_key_exists($post->post_type, self::POST_TYPES)) return;
        self::$deploy_on_shutdown = true;
    }

    public static function schedule_deploy_for_delete(int $post_id, WP_Post $post): void
    {
        if ($post->post_status !== 'publish') return;
        if ($post->post_type !== 'post' && !array_key_exists($post->post_type, self::POST_TYPES)) return;
        self::$deploy_on_shutdown = true;
    }

    public static function schedule_deploy_for_settings(): void
    {
        self::$deploy_on_shutdown = true;
    }

    public static function send_deploy_hook(): void
    {
        if (!self::$deploy_on_shutdown || get_transient('ng_deploy_hook_lock')) return;
        $settings = get_option('ng_site_settings', []);
        $url = isset($settings['deployHookUrl']) ? esc_url_raw($settings['deployHookUrl']) : '';
        if (!$url || !str_starts_with($url, 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/')) return;
        set_transient('ng_deploy_hook_lock', '1', 20);
        wp_remote_post($url, ['timeout' => 5, 'blocking' => false, 'redirection' => 0]);
    }

    public static function redirect_public_frontend(): void
    {
        $request_uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '';
        $is_rest_request = (defined('REST_REQUEST') && REST_REQUEST) || str_contains($request_uri, '/wp-json/');
        if (!is_admin() && !wp_doing_cron() && !$is_rest_request) {
            wp_safe_redirect(admin_url());
            exit;
        }
    }

    public static function force_noindex(array $robots): array
    {
        $robots['noindex'] = true;
        $robots['nofollow'] = true;
        return $robots;
    }
}
