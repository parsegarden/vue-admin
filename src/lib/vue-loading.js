import './vue-loading.css';

export default {
  params: ['loadingOptions'],
  handleShow () {
    if (window.getComputedStyle(this.el).position === 'static') {
      this.static = true;
      this.el.style.position = 'relative';
    }

    let box = document.createElement('div');
    box.className = 'vue-loading';
    this.el.appendChild(box);

    let msg = document.createElement('div');
    msg.className = 'vue-loading-msg';
    //msg.textContent = this.options.text;
    box.appendChild(msg);

    let ringPulse = document.createElement('div')
    ringPulse.className = 'ring-pulse';
    msg.appendChild(ringPulse);

    let innerDiv = document.createElement('div')
    msg.appendChild(innerDiv)

    let text = document.createElement('p')
    let strong = document.createElement('strong')
    strong.textContent = this.options.queryText;
    text.appendChild(strong)
    innerDiv.appendChild(text);

    text = document.createElement('p')
    strong = document.createElement('strong')
    strong.textContent = this.options.rangeText;
    text.appendChild(strong)
    innerDiv.appendChild(text);

    window.requestAnimationFrame(() => {
      box.style.opacity = 1;
    });

    this.loadingBox = box;
  },
  handleHide () {
    this.loadingBox.addEventListener('transitionend', () => {
      this.loadingBox.remove();

      if (this.static) {
        this.el.style.removeProperty('position');
      }
    });

    this.loadingBox.style.opacity = 0;
  },
  bind () {
    // is static
    this.static = false;
    // vue-loading dom
    this.loadingBox = null;
    // is first call update
    this.first = true;
    this.options = {
      text: 'Loading ...'
    };

    if (this.params.loadingOptions) {
      Object.assign(this.options, this.params.loadingOptions);
    }
  },
  update (value) {
    if (value) {
      if (this.params.loadingOptions) {
        Object.assign(this.options, this.params.loadingOptions);
      }
      this.first = false;
      this.handleShow();
    } else {
      if (this.first) {
        this.first = false;
        return;
      }
      this.handleHide();
    }
  }
};
