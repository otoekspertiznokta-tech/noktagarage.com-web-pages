<?php

if (!defined('ABSPATH')) {
    exit;
}

final class Nokta_Garage_Content
{
    private const POST_TYPES = [
        'ng_package' => ['Paketler', 'Paket', 'dashicons-clipboard'],
        'ng_service' => ['Hizmetler', 'Hizmet', 'dashicons-admin-tools'],
        'ng_campaign' => ['Kampanyalar', 'Kampanya', 'dashicons-megaphone'],
        'ng_gallery' => ['Galeri', 'Galeri Görseli', 'dashicons-format-gallery'],
        'ng_branch' => ['Şubeler', 'Şube', 'dashicons-location-alt'],
        'ng_page' => ['Site Sayfaları', 'Site Sayfası', 'dashicons-admin-page'],
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
        add_action('add_meta_boxes', [self::class, 'register_meta_boxes']);
        add_action('save_post', [self::class, 'save_fields'], 10, 2);
        add_action('save_post', [self::class, 'schedule_deploy_for_post'], 99, 2);
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
                'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'],
            ]);
        }
        add_post_type_support('post', 'thumbnail');
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
        $seo = [
            ['seo_title', 'SEO başlığı', 'text'],
            ['seo_description', 'SEO açıklaması', 'textarea'],
        ];
        $common = [
            ['active', 'Sitede aktif', 'checkbox'],
            ['order', 'Sıra', 'number'],
            ['image_id', 'Görsel', 'media'],
        ];

        return match ($type) {
            'ng_package' => array_merge($common, [
                ['summary', 'Kısa açıklama', 'textarea'],
                ['price', 'Fiyat (örn. 2.500 TL)', 'text'],
                ['previous_price', 'Önceki fiyat', 'text'],
                ['services', 'Paket kapsamı (her satıra bir hizmet)', 'textarea'],
                ['featured', 'Öne çıkan paket', 'checkbox'],
                ['cta_label', 'Buton yazısı', 'text'],
                ['cta_href', 'Buton adresi', 'url'],
                ['whatsapp_message', 'WhatsApp hazır mesajı', 'textarea'],
            ], $seo),
            'ng_service' => array_merge($common, [
                ['category', 'Kategori', 'text'],
                ['summary', 'Kısa açıklama', 'textarea'],
                ['icon', 'İkon anahtarı', 'select', self::ICONS],
            ], $seo),
            'ng_campaign' => array_merge($common, [
                ['summary', 'Kısa açıklama', 'textarea'],
                ['starts_at', 'Başlangıç tarihi', 'date'],
                ['ends_at', 'Bitiş tarihi', 'date'],
                ['cta_label', 'Buton yazısı', 'text'],
                ['cta_href', 'Buton adresi', 'url'],
                ['whatsapp_message', 'WhatsApp hazır mesajı', 'textarea'],
            ]),
            'ng_gallery' => [
                ['active', 'Sitede aktif', 'checkbox'],
                ['order', 'Sıra', 'number'],
                ['image_id', 'Görsel', 'media'],
                ['image_alt', 'Alternatif metin', 'text'],
                ['caption', 'Açıklama', 'text'],
                ['icon', 'Görsel yoksa ikon', 'select', ['building', 'car', 'gauge', 'scan']],
            ],
            'ng_branch' => array_merge([['active', 'Aktif şube', 'checkbox']], [
                ['city', 'İl', 'text'], ['district', 'İlçe', 'text'],
                ['address', 'Açık adres', 'textarea'], ['short_address', 'Kısa adres', 'text'],
                ['phone', 'Telefon görünümü', 'text'], ['phone_href', 'Telefon bağlantısı', 'text'],
                ['whatsapp', 'WhatsApp bağlantısı', 'url'], ['email', 'E-posta', 'email'],
                ['maps_url', 'Google Maps bağlantısı', 'url'], ['map_embed_url', 'Harita embed adresi', 'url'],
                ['working_hours', 'Çalışma saatleri', 'text'],
            ], $seo),
            'ng_page' => array_merge([
                ['hero_eyebrow', 'Hero üst başlık', 'text'], ['hero_heading', 'Hero başlığı', 'text'],
                ['hero_description', 'Hero açıklaması', 'textarea'], ['image_id', 'Hero görseli', 'media'],
                ['primary_cta_label', 'Birincil buton yazısı', 'text'], ['primary_cta_href', 'Birincil buton adresi', 'text'],
                ['secondary_cta_label', 'İkincil buton yazısı', 'text'], ['secondary_cta_href', 'İkincil buton adresi', 'text'],
                ['sections_json', 'Bölüm ayarları (JSON)', 'json'],
                ['quick_access_json', 'Hızlı erişim kartları (JSON)', 'json'],
                ['visibility_json', 'Görünürlük ayarları (JSON)', 'json'],
            ], $seo),
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
            self::render_control($key, $type, (string) $value, $options ?? []);
            echo '</td></tr>';
        }
        echo '</tbody></table>';
    }

    private static function render_control(string $key, string $type, string $value, array $options): void
    {
        $name = 'ng_' . $key;
        if ($type === 'checkbox') {
            echo '<input type="checkbox" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="1" ' . checked($value, '1', false) . '>';
            return;
        }
        if ($type === 'textarea' || $type === 'json') {
            echo '<textarea class="large-text' . ($type === 'json' ? ' code' : '') . '" rows="' . ($type === 'json' ? '8' : '4') . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">' . esc_textarea($value) . '</textarea>';
            return;
        }
        if ($type === 'select') {
            echo '<select id="' . esc_attr($name) . '" name="' . esc_attr($name) . '">';
            foreach ($options as $option) echo '<option value="' . esc_attr($option) . '" ' . selected($value, $option, false) . '>' . esc_html($option) . '</option>';
            echo '</select>';
            return;
        }
        if ($type === 'media') {
            $preview = $value ? wp_get_attachment_image((int) $value, 'thumbnail') : '';
            echo '<div class="ng-media-field"><input type="hidden" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '"><div class="ng-media-preview">' . wp_kses_post($preview) . '</div><button type="button" class="button ng-select-media">Görsel seç</button> <button type="button" class="button-link-delete ng-remove-media">Kaldır</button></div>';
            return;
        }
        echo '<input class="regular-text" type="' . esc_attr($type) . '" id="' . esc_attr($name) . '" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '">';
    }

    public static function save_fields(int $post_id, WP_Post $post): void
    {
        if (!isset($_POST['ng_content_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ng_content_nonce'])), 'ng_save_content')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        foreach (self::definitions($post->post_type) as [$key, , $type]) {
            $field = 'ng_' . $key;
            if ($type === 'checkbox') {
                update_post_meta($post_id, '_ng_' . $key, isset($_POST[$field]) ? '1' : '0');
                continue;
            }
            if (!isset($_POST[$field])) continue;
            $raw = wp_unslash($_POST[$field]);
            $value = match ($type) {
                'textarea' => sanitize_textarea_field($raw),
                'json' => self::sanitize_json($raw),
                'url' => esc_url_raw($raw),
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
        $url_keys = ['logo', 'alternateLogo', 'favicon', 'whatsappBaseUrl', 'mapsUrl', 'googleBusinessUrl', 'defaultSocialImage', 'deployHookUrl'];
        $textarea_keys = ['defaultWhatsappMessage', 'footerText', 'defaultSeoDescription'];
        $result = [];
        foreach ($input as $key => $value) {
            $result[$key] = in_array($key, $url_keys, true) ? esc_url_raw($value) : (in_array($key, $textarea_keys, true) ? sanitize_textarea_field($value) : sanitize_text_field($value));
        }
        return $result;
    }

    public static function render_settings_page(): void
    {
        if (!current_user_can('manage_options')) return;
        $settings = wp_parse_args(get_option('ng_site_settings', []), Nokta_Garage_Seeder::default_settings());
        $fields = [
            'brandName' => 'Marka adı', 'brandDescriptor' => 'Marka açıklaması', 'logo' => 'Logo URL',
            'alternateLogo' => 'Alternatif logo URL', 'favicon' => 'Favicon URL', 'primaryPhone' => 'Telefon görünümü',
            'phoneHref' => 'Telefon bağlantısı', 'whatsappBaseUrl' => 'WhatsApp bağlantısı', 'email' => 'E-posta',
            'defaultWhatsappMessage' => 'Varsayılan WhatsApp mesajı', 'footerText' => 'Footer metni',
            'copyright' => 'Telif metni', 'mapsUrl' => 'Harita bağlantısı', 'googleBusinessUrl' => 'Google Business bağlantısı',
            'workingHours' => 'Çalışma saatleri', 'defaultSeoTitle' => 'Varsayılan SEO başlığı',
            'defaultSeoDescription' => 'Varsayılan SEO açıklaması', 'defaultSocialImage' => 'Varsayılan sosyal görsel URL',
            'deployHookUrl' => 'Cloudflare Pages Deploy Hook (gizli)',
        ];
        echo '<div class="wrap"><h1>Nokta Garage Site Ayarları</h1><p>Kaydedilen değişiklik canlı site build’ini otomatik tetikler. Yayına geçiş genellikle 1–3 dakika sürer.</p><form method="post" action="options.php">';
        settings_fields('ng_site_settings_group');
        echo '<table class="form-table"><tbody>';
        foreach ($fields as $key => $label) {
            $type = $key === 'deployHookUrl' ? 'password' : 'text';
            echo '<tr><th><label for="ng_setting_' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td><input class="large-text" type="' . $type . '" autocomplete="off" id="ng_setting_' . esc_attr($key) . '" name="ng_site_settings[' . esc_attr($key) . ']" value="' . esc_attr($settings[$key] ?? '') . '"></td></tr>';
        }
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
                'cta' => ['label' => $meta('cta_label', 'Bilgi Al'), 'href' => $meta('cta_href', '/randevu')],
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
        return apply_filters('the_content', $content);
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
