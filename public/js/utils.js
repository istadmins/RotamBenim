// Basit yardımcı fonksiyonlar
window.Utils = {
  logError: function(error, context) {
    console.error('[Utils]', context || '', error);
  },
  debounce: function (func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
};

// Basit toast fonksiyonu
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('toastContainer')) {
    const toastDiv = document.createElement('div');
    toastDiv.id = 'toastContainer';
    toastDiv.style.position = 'fixed';
    toastDiv.style.top = '1rem';
    toastDiv.style.right = '1rem';
    toastDiv.style.zIndex = '9999';
    document.body.appendChild(toastDiv);
  }
});

window.showToast = function(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#f87171' : (type === 'success' ? '#4ade80' : '#60a5fa');
  toast.style.color = '#fff';
  toast.style.padding = '12px 20px';
  toast.style.marginTop = '8px';
  toast.style.borderRadius = '6px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
  toast.style.fontWeight = 'bold';
  toast.style.fontSize = '1rem';
  toast.style.opacity = '0.95';
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, duration);
}; 