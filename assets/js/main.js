
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 24
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})()

function addBusiness(){
  const apiurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/business"
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;
  const address = document.getElementById("address").value;
  const businessname = document.getElementById("businessname").value;
  const businessaddress = document.getElementById("businessaddress").value;
  const businesstype = document.getElementById("businesstype").value;
  const summary = document.getElementById("summary").value;

  fetch(apiurl, {
      method: "POST",
      headers: {
          "Accept": 'application/json',
          "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullname: fullname,
        address: address,
        businessname: businessname,
        businessaddress: businessaddress,
        businesstype: businesstype,
        businessSummary: summary

      })
  }).then((response)=>{
      console.log(response)
  })
}

function addCustomer(){
  const apiurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/customer"
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;
  const address = document.getElementById("address").value;

  fetch(apiurl, {
      method: "POST",
      headers: {
          "Accept": 'application/json',
          "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullname: fullname,
        address: address
      })
  }).then((response)=>{
      console.log(response)
  })
}

function businessLogin(){
  const email = document.getElementById("username").value;
  const businessurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/business/" + email;
  // const password = document.getElementById("password").value;

    fetch(businessurl).then(function(response){
      console.log(response);
      return response.json();
  }).then(function(json){
          let html = "<div>";
          json.forEach((business)=>{
              html += "<fieldset>" + "<legend>" + "<h3>Business Profile</h3>" + "</legend>" +
                      "<div  class='account-details'>" +
                      "<div>" + "<label><font size='+2'>Business Name: </font></label><font size = '+1'>" + business.businessName + "</font></div>" +
                      "<div>" + "<label><font size='+2'>Type: </font></label><font size = '+1'>" + business.businessType + "</font></div>" +
                      "<div>" + "<label><font size='+2'>Address: </font></label><font size = '+1'>" + business.businessAddress + "</font></div>" +
                      "<div>" + "<label><font size='+2'>Summary: </font></label><font size = '+1'>" + business.businessSummary + "</font></div>" +
                      "</div>" + "</fieldset>" + "<fieldset>" + " </div>" + " </fieldset>" +
                      "<a href='BusinessRSVP.html'>Click here to Register for an Event</a>"
          }); 
          html += "</div>";
          document.getElementById("profile").innerHTML = html;
      }).then((response)=>{
    console.log(response)
})
}

function selectCustomer(){
  const email = document.getElementById("email").value;
  const customerurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/customer/" + email;
  // const password = document.getElementById("password").value;

  fetch(customerurl).then(function(response){
    console.log(response);
    return response.json();
}).then(function(json){
        let html = "<div>";
            html += "<a href='CustomerRSVP.html'>Click here to Register for an Event</a>";

        html += "</div>";
        document.getElementById("profile").innerHTML = html;
    }).then((response)=>{
  console.log(response)
})
}

function getEvents(){
  const eventsurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/event";

  fetch(eventsurl).then(function(response){
      console.log(response);
      return response.json();
  }).then(function(json){
          let html = "<ul>";
          json.forEach((event)=>{
              html += "<li>" + "ID:     " + event.eventID + "     " + "Date: " + event.date + "   " + "Time: " + event.time + "</li>";
          }); 
          html += "</ul>";
          document.getElementById("events").innerHTML = html;
      })
  }

  function businessRSVP(){
    const apiurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/businessRegistration"
    const email = document.getElementById("email").value;
    const eventid = document.getElementById("eventid").value;
    const creditcard = document.getElementById("creditcard").value;
  
    fetch(apiurl, {
        method: "POST",
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          email: email,
          eventid: eventid,
          creditcard: creditcard
        })
    }).then((response)=>{
        console.log(response)
    })

  }

  function customerRSVP(){
    const apiurl = "https://bigalsfarmersmarketapi.herokuapp.com/api/account/customerRegistration"
    const email = document.getElementById("email").value;
    const eventid = document.getElementById("eventid").value;
    
    fetch(apiurl, {
        method: "POST",
        headers: {
            "Accept": 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          email: email,
          eventid: eventid,
        })
    }).then((response)=>{
        console.log(response)
    })

  }
  function customerRSVP(){
    
  }