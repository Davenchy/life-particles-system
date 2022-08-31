class GUI {
  constructor(onApply) {
    this.options = [];

    this.gui = document.getElementById("gui");
    this.variantsDom = document.getElementById("variants");
    this.rulesDom = document.getElementById("rules");

    this.onClick("close-btn", e => this.toggle());
    this.onClick("add-btn", e => this.add(true));
    this.onClick("apply-btn", e => onApply());

    this.update();
  }

  onClick(id, cb) {
    document.getElementById(id).addEventListener("click", cb);
  }

  toggle() {
    this.gui.classList.toggle("active");
  }

  add() {
    const o = new Option(
      true,
      () => {
        const i = this.options.findIndex(n => n.id === o.id);
        this.options.splice(i, 1);
        this.update();
      },
      this.update.bind(this)
    );

    this.options.push(o);
    this.update();
    return o;
  }

  toJson() {
    return this.options.map(o => o.toJson());
  }

  toString() {
    return JSON.stringify(this.toJson());
  }

  save() {
    localStorage.setItem("options", this.toString());
  }

  loadFromString(str = "[]") {
    const json = JSON.parse(str);
    this.load(json);
  }

  load(json) {
    const options = json || JSON.parse(localStorage.getItem("options") || "[]");
    options.forEach(d => {
      const o = this.add();
      o.color = d.color;
      o.value = d.value;
      d.rules.forEach(r => {
        const u = o.addRule();
        u.target = r.target;
        u.value = r.value;
      });
    });
  }

  update() {
    const { variantsDom: v, rulesDom: r } = this;
    for (const child of v.children) {
      v.removeChild(child);
    }
    for (const child of r.children) {
      r.removeChild(child);
    }
    this.options.forEach(o => {
      v.appendChild(o.dom);
      o.rules.forEach(rule => r.appendChild(rule.dom));
    });
  }
}

class Option {
  static _id = 0;
  constructor(isVariant, onRemove, update) {
    this.id = Option._id++;
    this._update = update;
    this.isVariant = isVariant;
    this.rules = [];

    this.dom = document.createElement("div");
    this.dom.classList.add("option");

    this.removeBtn = document.createElement("span");
    this.removeBtn.classList.add("p-remove-btn");
    this.removeBtn.innerText = "X";
    this.removeBtn.addEventListener("click", onRemove);

    this.colorText = document.createElement("span");
    this.colorText.innerText = "Color:";

    this.colorInput = document.createElement("input");
    this.colorInput.setAttribute("type", "text");
    this.colorInput.setAttribute("placeholder", "red");
    this.colorInput.value = "red";

    this.colorInput.addEventListener("change", e => {
      this.rules.forEach(r => (r.color = this.color));
    });

    if (!isVariant) {
      this.targetText = document.createElement("span");
      this.targetText.innerText = "Target:";

      this.targetInput = document.createElement("input");
      this.targetInput.setAttribute("type", "text");
      this.targetInput.value = "blue";
    }

    this.valueText = document.createElement("span");
    this.valueText.innerText = isVariant ? "Count:" : "Relation:";

    this.valueInput = document.createElement("input");
    this.valueInput.setAttribute("type", "number");
    this.valueInput.value = "10";

    if (isVariant) {
      this.addRuleBtn = document.createElement("button");
      this.addRuleBtn.innerText = "Add Rule";
      this.addRuleBtn.addEventListener("click", e => this.addRule());
    }

    this.dom.appendChild(this.removeBtn);
    this.dom.appendChild(this.colorText);
    this.dom.appendChild(this.colorInput);
    if (!isVariant) {
      this.dom.appendChild(this.targetText);
      this.dom.appendChild(this.targetInput);
    }
    this.dom.appendChild(this.valueText);
    this.dom.appendChild(this.valueInput);
    if (isVariant) this.dom.appendChild(this.addRuleBtn);
  }

  addRule() {
    const rule = new Option(false, () => {
      const i = this.rules.findIndex(n => n.id === rule.id);
      this.rules.splice(i, 1);
      this._update();
    });
    rule.colorInput.setAttribute("disabled", true);
    rule.color = this.color;
    rule.target = this.color;
    this.rules.push(rule);
    this._update();
    return rule;
  }

  set color(c) {
    this.colorInput.value = c;
  }

  get color() {
    return this.colorInput.value;
  }

  set value(val) {
    this.valueInput.value = val;
  }

  get value() {
    return Number.parseInt(this.valueInput.value) || 0;
  }

  set target(tar) {
    if (this.isVariant) return;
    this.targetInput.value = tar;
  }

  get target() {
    if (this.isVariant) return "";
    return this.targetInput.value;
  }

  toJson() {
    return {
      isVariant: this.isVariant,
      rules: this.rules.map(r => r.toJson()),
      color: this.color,
      target: this.target,
      value: this.value
    };
  }
}
