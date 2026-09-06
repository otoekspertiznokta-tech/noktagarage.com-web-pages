(function ($) {
  $(document).on('click', '.ng-select-media', function () {
    const field = $(this).closest('.ng-media-field');
    const frame = wp.media({ title: 'Site görselini seç', button: { text: 'Bu görseli kullan' }, multiple: false });
    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON();
      field.find('input[type="hidden"]').val(attachment.id);
      field.find('.ng-media-preview').html('<img src="' + attachment.url + '" style="max-width:150px;height:auto" alt="">');
    });
    frame.open();
  });
  $(document).on('click', '.ng-remove-media', function () {
    const field = $(this).closest('.ng-media-field');
    field.find('input[type="hidden"]').val('');
    field.find('.ng-media-preview').empty();
  });
})(jQuery);
