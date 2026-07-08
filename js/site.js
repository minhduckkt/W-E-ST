(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setExpanded(element, isOpen) {
    if (element && element.setAttribute) {
      element.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  function bindMobileNavigation() {
    var menu = document.getElementById("wh-mobile-menu");

    document.querySelectorAll(".wh-hamburger").forEach(function (button) {
      if (button.dataset.siteBound === "1") return;
      button.dataset.siteBound = "1";
      button.addEventListener("click", function () {
        if (!menu) return;
        var isOpen = menu.classList.toggle("open");
        button.classList.toggle("open", isOpen);
        setExpanded(button, isOpen);
      });
    });

    document.querySelectorAll(".wh-mob-toggle").forEach(function (toggle) {
      if (toggle.dataset.siteBound === "1") return;
      toggle.dataset.siteBound = "1";

      function toggleSubmenu() {
        var submenu = toggle.nextElementSibling;
        if (!submenu) return;
        var isOpen = submenu.classList.toggle("open");
        toggle.classList.toggle("open", isOpen);
        setExpanded(toggle, isOpen);
      }

      toggle.addEventListener("click", toggleSubmenu);
      toggle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleSubmenu();
        }
      });
    });
  }

  function bindDesktopDropdowns() {
    document.querySelectorAll(".wh-nav-item").forEach(function (item) {
      if (item.dataset.dropdownBound === "1") return;

      var trigger = item.querySelector(":scope > .wh-nav-link");
      var dropdown = item.querySelector(":scope > .wh-dropdown");
      if (!trigger || !dropdown) return;

      item.dataset.dropdownBound = "1";

      trigger.addEventListener("click", function (event) {
        if (window.matchMedia && window.matchMedia("(max-width: 980px)").matches) return;
        event.preventDefault();

        document.querySelectorAll(".wh-nav-item.open").forEach(function (openItem) {
          if (openItem !== item) openItem.classList.remove("open");
        });

        item.classList.toggle("open");
      });

      item.addEventListener("mouseleave", function () {
        item.classList.remove("open");
      });
    });

    if (document.documentElement.dataset.desktopDropdownGlobalBound === "1") return;
    document.documentElement.dataset.desktopDropdownGlobalBound = "1";

    document.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest(".wh-nav-item")) return;
      document.querySelectorAll(".wh-nav-item.open").forEach(function (item) {
        item.classList.remove("open");
      });
    });
  }

  function bindQuoteForm() {
    var form = document.getElementById("request-quote-form");
    if (!form || form.dataset.siteBound === "1") return;
    form.dataset.siteBound = "1";

    var status = document.getElementById("form-status");
    if (!status) {
      status = document.createElement("div");
      status.id = "form-status";
      status.style.display = "none";
      status.style.marginTop = "15px";
      status.style.padding = "12px";
      status.style.borderRadius = "4px";
      status.style.fontSize = "13px";
      status.style.fontWeight = "bold";
      status.style.textAlign = "center";
      form.parentNode.insertBefore(status, form.nextSibling);
    }

    function showStatus(message, isSuccess) {
      status.style.display = "block";
      status.style.backgroundColor = isSuccess ? "#e6fffa" : "#fff5f5";
      status.style.color = isSuccess ? "#00664f" : "#a71d1d";
      status.style.border = isSuccess ? "1px solid #b2f5ea" : "1px solid #feb2b2";
      status.innerText = message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.style.display = "none";

      var xhr = new XMLHttpRequest();
      xhr.open(form.method, form.action);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          form.reset();
          showStatus("Cám ơn bạn! Yêu cầu báo giá đã được gửi thành công.", true);
        } else {
          showStatus("Có lỗi xảy ra. Vui lòng thử lại sau.", false);
        }
      };
      xhr.send(new FormData(form));
    });
  }

  window.filterTable = function () {
    var input = document.getElementById("tl-search-input");
    if (!input) return;
    var query = input.value.toLowerCase();

    document.querySelectorAll(".tl-row").forEach(function (row) {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });

    document.querySelectorAll(".tl-section").forEach(function (section) {
      var visible = Array.prototype.some.call(section.querySelectorAll(".tl-row"), function (row) {
        return row.style.display !== "none";
      });
      section.style.display = query && !visible ? "none" : "";
    });
  };

  onReady(function () {
    bindMobileNavigation();
    bindDesktopDropdowns();
    bindQuoteForm();
  });
})();
