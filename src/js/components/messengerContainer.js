/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class MessengerContainer {

  constructor(onSendMessage) {
    this.onSendMessage = onSendMessage;
    this.messengerContent = null;
    this.participants = {};
    
  }

  setParticipants(participants) {
    this.participants = participants;
  }

  getStyle(name, defaultStyle = null) {
    const theme = this.theme[name];
    if (theme && theme.style) {
      return theme.style;
    }
    return defaultStyle;
  }

  setStyle(el, name, defaultStyle = null) {
    const style = this.getStyle(name, defaultStyle);
    this.setSubStyle(el, style);
    if (style) {
      el.setAttribute("style", style);    
    }
  }

  setSubStyle(el, t) {
    if (t && t.style) {
        el.setAttribute("style", t.style);    
    }
  }

    // MaterialDesign Input
  // Inspiration : https://codepen.io/sevilayha/pen/IdGKH
  renderTextField({ label = null, floatingLabel = false, onEnter = null }) {
    const container = document.createElement("div");
    container.className = "mdx-textfield";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.className = "mdx-textfield__input";
    input.id = "chat-input-field";
    container.appendChild(input);
    let s = document.createElement("span");
    s.className = "mdx-textfield__highlight";
    container.appendChild(s);
    s = document.createElement("span");
    s.className = "mdx-textfield__bar";
    container.appendChild(s);
    let l = null;
    if (label) {
      l = document.createElement("label");
      l.setAttribute("for", "chat-input-field");
      l.className = "mdx-textfield__label";
      l.innerText= label;
      container.appendChild(l);
    }
    input.addEventListener("keyup", (e) => {
      const value = e.target.value || "";
      if (e.key === "Enter" && value.length > 0) {
        let result = false;
        if (onEnter) {
          result = onEnter(value);
        }
        if (result) {
          e.target.value = "";        
        }
        return;
      }
      if ((!floatingLabel) && l) {
        if (value.length > 0) {
          l.setAttribute("style", "display: none;");
        } else {
          l.setAttribute("style", "display: block;");        
        }
      }
    });
    return container;
  }

  resetMessages() {
    this.messengerContent.innerHTML = "";
    this.setWelcomeMessage();
  }

  setWelcomeMessage(welcome = this.welcome ) {
    // Display Welcome message
    this.welcome = welcome;
    let messageRow = document.createElement("div");
    this.setStyle(messageRow, "welcomeMessage"); 
    messageRow.className = "message_welcome";
    messageRow.innerText = welcome || getLocalizedText("Welcome message");
    this.messengerContent.appendChild(messageRow);
  }

  appendMessage(message){
    let messageRow = document.getElementById("msg_"+ message.id);
    if (messageRow) {
      // TODO check if body is different
      return;
    }
    const fromUser = message.from;
    const user = this.participants[fromUser]; 
    let dest = "you";
    let icon = "default";
    if (user) {
      dest = user.dest;
      icon = user.icon;
    }
    let theme = this.theme.fromMessage || { };
    if (dest === "you") {
      theme = this.theme.toMessage || { };
    }
    messageRow = document.createElement("div");
    messageRow.id = "msg_" + message.id;
    messageRow.className = "message " + dest + " " + icon;
    messageRow.setAttribute("timestamp", message.timestamp);
    let child = document.createElement("div");
    child.className = "circle-wrapper animated bounceIn";
    this.setSubStyle(child, theme.icon);
    messageRow.appendChild(child);
    child = document.createElement("div");
    child.className = "text-wrapper animated fadeIn";
    this.setSubStyle(child, theme.text);
    child.innerHTML = message.body;
    messageRow.appendChild(child);
    
    const children = this.messengerContent.children;
    let b = true;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c.hasAttribute("timestamp")) {
        const timestamp = parseInt(c.getAttribute("timestamp"));
        if (message.timestamp < timestamp) {
          this.messengerContent.insertBefore(messageRow, c);
          b = false;
          break;
        }  
      }
    }
    if (b) {
      this.messengerContent.appendChild(messageRow);      
    }

    const node = this.messengerContent;
    node.scrollTop = node.scrollHeight;
  }

  render(theme = { }) {
    this.theme = theme;
    const container = document.createElement("div");
    container.className = "dialog_bg";
    
    const messengerBox = document.createElement("div");
    messengerBox.className = "messenger-box messenger-box-app";
    // this.setStyle(messengerBox, "messengerBox", "width: 520px; margin: 4% auto; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);"); 
  
    this.messengerContent = document.createElement("div");
    this.messengerContent.className = "messenger-content messenger-content-app bounceOutRight bounceInRight";
    // this.setStyle(this.messengerContent, "messengerContent", "height: calc(100% - 40px);");     
    messengerBox.appendChild(this.messengerContent);
    
    const messengerBoxActions = document.createElement("div");
    messengerBoxActions.className = "messenger-box__actions";
    this.setStyle(messengerBoxActions, "messengerBoxActions", "background:white;");
    messengerBox.appendChild(messengerBoxActions);  
    const textField = this.renderTextField({ label: getLocalizedText("Your message"), onEnter: this.onSendMessage });
    messengerBoxActions.appendChild(textField);
    
    container.appendChild(messengerBox);

    return container;
  }
}