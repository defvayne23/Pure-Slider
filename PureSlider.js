(function () {
  'use strict';

  var sliders = document.querySelectorAll('.slider');
  Array.prototype.forEach.call(sliders, function(slider, i) {
    var slides = slider.querySelectorAll('.slides > div'),
        slider_container = slider.querySelector('.slides'),
        slide_clone_left = null,
        slider_width = 0,
        slide_width = 0,
        slide_height = 0;

    // Setup slides and add clones
    Array.prototype.forEach.call(slides, function(slide, i) {
      // Set slides
      slide_width = slide.clientWidth;
      slide_height = slide.clientHeight;
      slide.classList.add('slide');

      slider_width += slide_width;

      // Add left side clone
      if(slide_clone_left === null) {
        slide_clone_left = slide.cloneNode(true);
        slide_clone_left.classList.add('slide-clone');
        slide_clone_left = slide.parentNode.insertBefore(slide_clone_left, slide.parentNode.firstChild);
      } else {
        var slide_clone_left_temp = slide.cloneNode(true);
        slide_clone_left_temp.classList.add('slide-clone');
        slide_clone_left.insertAdjacentHTML('afterend', slide_clone_left_temp.outerHTML);
        slide_clone_left = slide_clone_left.nextElementSibling;
      }

      // Add right side clone
      var slide_clone_right = slide.cloneNode(true);
      slide_clone_right.classList.add('slide-clone');
      slide_clone_right = slide.parentNode.appendChild(slide_clone_right);

      if(slides.length === 1) {
        slide_clone_left.classList.add('invisible');
        slide_clone_right.classList.add('invisible');
      }
    });

    if(window.innerWidth >= 680) {
      var multiplyer = 3;

      // Set slide width so everything is on one line
      slider_container.style.width = (slider_width * multiplyer)+'px'; // Width of slides and clones

      // Animate to first slide that is not clone
      var slideOffset = slider_width * -1;
      slideOffset += (slider_container.parentNode.clientWidth / 2) - (slide_width / 2);
      slideOffset += parseInt(window.getComputedStyle(slider_container.parentNode).getPropertyValue('padding-left')) * -1;

      slider.setAttribute('data-slide-offset', slideOffset);

      move(slider_container)
        .translate(slideOffset, 0)
        .duration('0s')
        .end();
    }

    // Set current
    slider.querySelector('.slides > div:not(.slide-clone)').classList.add('current');

    // Paging
    var paging = slider.querySelectorAll('.slider-next, .slider-prev');
    Array.prototype.forEach.call(paging, function(page, i) {
      page.addEventListener('click', function(event) {
        event.preventDefault();

        var slideOffsetBase = slider.getAttribute('data-slide-offset'),
            current = slider.querySelector('.current'),
            next_slide = null;

        if(event.target.classList.contains('slider-next')) {
          next_slide = current.nextElementSibling;
        } else {
          next_slide = current.previousElementSibling;
        }

        var new_index = ([].indexOf.call(slider.querySelectorAll('.slides > div'), next_slide) - slides.length),
            offset = slideOffsetBase - (slide_width * new_index);

        current.classList.remove('current');
        next_slide.classList.add('current');

        if(next_slide.classList.contains('slide-clone')) {
          var future_index = 0,
              new_next_slide = null;

          if(event.target.classList.contains('slider-next')) {
            new_next_slide = slider.querySelectorAll('.slides > div')[slides.length];
            future_index = 0;
          } else {
            new_next_slide = slider.querySelectorAll('.slides > div')[slides.length + (slides.length - 1)];
            future_index = (slides.length - 1);
          }

          var new_offset = slideOffsetBase - (slide_width * future_index);

          new_next_slide.classList.add('current');

          move(slider_container)
            .translate(offset, 0)
            .end(function() {
              move(slider_container)
                .translate(new_offset, 0)
                .duration('0s')
                .end(function() {
                  next_slide.classList.remove('current');
                });
            });
        } else {
          move(slider_container)
            .translate(offset, 0)
            .end();
        }
      });
    });
  });

  window.addEventListener('resize', function(event) {
    var sliders = document.querySelectorAll('.slider');
    Array.prototype.forEach.call(sliders, function(slider, i) {
      var slides = slider.querySelectorAll('.slides > div:not(.slide-clone)'),
          slider_container = slider.querySelector('.slides'),
          slide_clone_left = null,
          slider_width = 0,
          slide_width = 0;

      // Reset some styles to get new width
      slider_container.style.width = 'auto';

      if(window.innerWidth >= 680) {
        Array.prototype.forEach.call(slides, function(slide, i) {
          // Set slides
          slide_width = slide.clientWidth;

          slider_width += slide_width;
        });

        // Set slide width so everything is on one line
        slider_container.style.width = (slider_width * 3)+'px'; // Width of slides and clones

        // Animate to first slide that is not clone
        var slideOffset = slider_width * -1;
        slideOffset += (slider_container.parentNode.clientWidth / 2) - (slide_width / 2);
        slideOffset += parseInt(window.getComputedStyle(slider_container.parentNode).getPropertyValue('padding-left')) * -1;

        slider.setAttribute('data-slide-offset', slideOffset);

        var current = slider.querySelector('.current'),
            new_index = ([].indexOf.call(slider.querySelectorAll('.slides > div'), current) - slides.length),
            offset = slideOffset - (slide_width * new_index);

        move(slider_container)
          .translate(offset, 0)
          .duration('0s')
          .end();
      } else {
        // Reset translate to 0
        move(slider_container)
          .translate(0, 0)
          .duration('0s')
          .end();
      }
    });
  });
}());
