$(document).ready(function() {
  initProductPage();
  collapseDescription();
  filterSearch();
})

const initProductPage = function() {
  $(document).on('click', '[data-popup-open]', function() {
    var handle = $(this).attr('data-popup-open');
    $('.popup[data-popup="' + handle + '"]').addClass('visible');
  })

  $(document).on('click', '[data-popup-close]', function() {
    $(this).closest('.popup.visible').removeClass('visible');
  })
}

const collapseDescription = function() {
  $(document).on('click', '.btn-read_more span', function() {
    $(this).closest('.btn-read_more').find('span').toggleClass('hide');
    $(this).closest('.collection-header__description').find('.full-desc').toggleClass('hide');
    $(this).closest('.collection-header__description').find('.short-desc').toggleClass('hide');
  })
}

const filterSearch = function() {
  $(document).on('keydown', '.filter-search-wrapper input', function() {
    var $input = $(this);
    setTimeout(function() {
      var keyword = $input.val().toLowerCase().replace(' ', '-');
      $input.closest('.widget-filter').find('ul.sf__list-row li').each(function() {
        var text = $(this).find('a').text().toLowerCase().replace(' ', '-');
        if(text.indexOf(keyword) > -1) {
          $(this).removeAttr('data--hidden');
        }
        else {
          $(this).attr('data--hidden', true);
        }
      });
    });
  })
}