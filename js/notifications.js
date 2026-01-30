/**
 * Modern Toast Notification System
 * Replaces default browser alerts with professional, animated toasts.
 */

class Toast {
  static containerId = "toast-container";

  // Icons (SVG strings for independence from external libs)
  static icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-danger"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-warning"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  };

  static init() {
    if (!document.getElementById(this.containerId)) {
      const container = document.createElement("div");
      container.id = this.containerId;
      document.body.appendChild(container);
    }
  }

  static show(message, type = "info", duration = 3000) {
    this.init();
    const container = document.getElementById(this.containerId);

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `custom-toast toast-${type}`;

    // Icon
    const iconHtml = this.icons[type] || this.icons.info;

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    // Append to container
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Close button event
    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.dismiss(toast);
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }
  }

  static dismiss(toast) {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }

  // Shortcuts
  static success(msg, duration) {
    this.show(msg, "success", duration);
  }
  static error(msg, duration) {
    this.show(msg, "error", duration);
  }
  static warning(msg, duration) {
    this.show(msg, "warning", duration);
  }
  static info(msg, duration) {
    this.show(msg, "info", duration);
  }
}

// Attach to window for global access
window.Toast = Toast;