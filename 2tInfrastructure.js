class DDropdownLoader {
    #TabPressed = false;
    #MouseX=-1;
    #MouseY=-1;
    #Timer = null;
    constructor(onkeyupMillisecondsDelay = 400) {
        const ddropdowns = document.querySelectorAll('div[data-component="dinamic-dropdown"]');
        ddropdowns.forEach(div => {
            //Mouse move
            document.addEventListener('mousemove', (event) => { this.#MouseX = event.clientX, this.#MouseY = event.clientY });
            var input = div.querySelector('input[type="text"][data-role="editor"]');
            var description = div.querySelector("input[type='hidden'][data-description]");
            description.dataset.description = description.value;
            var key = div.querySelector("input[type='hidden'][data-key]");
            key.dataset.key = key.value;
            input.readOnly = (div.dataset.url.trim() == '');
            //show initial description
            input.value = description.value;
            //load event
            //blur event
            input.addEventListener('blur', (e)=> {
                var div = e.target.parentNode;
                var select = div.nextElementSibling;
                var description = div.querySelector("input[type='hidden'][data-description]");
                var tabPressed = this.#IsTabPressed();
                var pointerOver = this.#IsPointerOver(select);
                if ((tabPressed) || (tabPressed == false && pointerOver == false)) {
                    var input = div.querySelector("input[type='text']");
                    if (input.value != description.dataset.description) {
                        input.value = description.dataset.description;
                    }
                    if (!select.classList.contains("d-none")) select.classList.add("d-none");
                    select.innerHTML = '';
                }
            });
            //onresize event
            window.addEventListener('resize', ()=> {
                const selects = document.querySelectorAll('select[data-role="dinamic-dropdown-items"]:not(.d-none)');
                selects.forEach(select => {
                    select.style.width = select.previousElementSibling.clientWidth + 'px';
                })
            });
            //blur event on select element
            div.nextElementSibling.addEventListener('blur', (e)=> {
                var div = e.target.previousElementSibling;
                var description = div.querySelector("input[type='hidden'][data-description]");
                div.querySelector("input[type='text']").value = description.dataset.description;
                if (!e.target.classList.contains("d-none")) e.target.classList.add("d-none");
                e.target.innerHTML = '';
            });
            //keydown event
            input.addEventListener('keydown', (e) => {
                this.#TabPressed = (e.which == 9)
            });
            //keyup event
            input.addEventListener('keyup', ()=> {
                if (this.#Timer != null) clearTimeout(this.#Timer);
                this.#Timer = setTimeout(() => { this.#load(div) }, onkeyupMillisecondsDelay);
            });
            //cut event
            input.addEventListener('cut', ()=> {
                if (this.#Timer != null) clearTimeout(this.#Timer);
                this.#Timer = setTimeout(() => { this.#load(div) }, onkeyupMillisecondsDelay);
            });
            //paste event
            input.addEventListener('paste', ()=> {
                if (this.#Timer != null) clearTimeout(this.#Timer);
                this.#Timer = setTimeout(() => { this.#load(div) }, onkeyupMillisecondsDelay);
            });
            //dblclick event
            input.addEventListener('dblclick', ()=> {
                if (this.#Timer != null) clearTimeout(this.#Timer);
                this.#Timer = setTimeout(() => { this.#load(div) }, onkeyupMillisecondsDelay);
            });
        })
    }
    MouseX() { return this.#MouseX }
    MouseY() { return this.#MouseY }
    Save(context=null) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="dinamic-dropdown"]' + filter);
        containers.forEach(container => {
            var datakey = container.querySelector('input[type="hidden"][data-key]');
            var datadescription = container.querySelector('input[type="hidden"][data-description]');
            datakey.value = datakey.dataset.key;
            datadescription.value = datadescription.dataset.description;
        });
    }
    Restores(context=null) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="dinamic-dropdown"]' + filter);
        containers.forEach(container => {
            var input = container.querySelector('input[type="text"][data-role="editor"]');
            var datakey = container.querySelector('input[type="hidden"][data-key]');
            var datadescription = container.querySelector('input[type="hidden"][data-description]');
            datakey.dataset.Key = datakey.value;
            datadescription.dataset.description = datadescription.value;
            input.value = datadescription.value;
            input.focus();
        });
    }
    Clear(context=null) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="dinamic-dropdown"]' + filter);
        containers.forEach(container => {
            var input = container.querySelector('input[type="text"][data-role="editor"]');
            var datakey = container.querySelector('input[type="hidden"][data-key]');
            var datadescription = container.querySelector('input[type="hidden"][data-description]');
            input.value = '';
            datakey.value = '';
            datakey.dataset.Key = '';
            datadescription.value = '';
            datadescription.dataset.description = '';
        });
    }
    GetKeyAndDescriptioValues(containerId) {
        const container = document.getElementById(containerId);
        return {
            key: container.querySelector('input[type="hidden"][data-key]').value,
            description: container.querySelector('input[type="hidden"][data-description]').value
        }
    }
    WriteUrl(containerId, url) {
        var div = document.getElementById(containerId);
        var input = div.querySelector('input[type="text"][data-role="editor"]');
        url = url.trim();
        input.readOnly = (url == '');
        div.dataset.url = url;
    }
    Load(containerId, keyValue, descriptionValue) {
        const div = document.getElementById(containerId);
        const key = div.querySelector("input[type='hidden'][data-key]");
        const description = div.querySelector("input[type='hidden'][data-description]");
        const input = div.querySelector('input[type="text"][data-role="editor"]');
        key.value = keyValue; 
        key.dataset.key = keyValue;
        description.value = descriptionValue; 
        description.dataset.description = descriptionValue;
        //show initial description
        input.value = descriptionValue;
    }
    #GetContainerElements(container) {
        const input = container.querySelector('input[type="text"][data-role="editor"]');
        const description = container.querySelector("input[type='hidden'][data-description]");
        const key = container.querySelector("input[type='hidden'][data-Key]");
        const descriptionField = container.dataset.descriptionField;
        const keyField = container.dataset.keyField;
        const urlSearchParamName = container.dataset.urlSearchParamName;
        const select = container.nextElementSibling;
        const url = container.dataset.url.trim();
        const hourglass = container.querySelector('[data-role="hourglass"]');
        const error = container.querySelector('span[data-role="error"]');
        return {
            select: select,
            input: input,
            url: url,
            hourglass: hourglass,
            error: error,
            descriptionField: descriptionField,
            KeyField: keyField,
            urlSearchParamName: urlSearchParamName,
            description: description,
            Key: key
        }
    }
    #IsTabPressed() {
        var pressed = this.#TabPressed;
        this.#TabPressed = false;
        return pressed;
    }
    #IsPointerOver(element) {
        if (this.#MouseX < 0 || this.#MouseY < 0) return false;
        const elementUnderPointer = document.elementFromPoint(this.#MouseX, this.#MouseY);
        return elementUnderPointer === element || element.contains(elementUnderPointer);
    }
    #AddOption(select, keyvalue, descriptionvalue, input, description, key) {
        var option = document.createElement("option");
        option.setAttribute("key", keyvalue);
        option.innerHTML = descriptionvalue;
        option.onclick = function (e) {
            e.stopPropagation();
            description.dataset.description = e.target.innerText; 
            key.dataset.Key = e.target.getAttribute("key");
            input.value = e.target.innerText;
            if (!select.classList.contains("d-none")) select.classList.add("d-none");
            select.innerHTML = '';
            input.focus();
        }
        select.appendChild(option);
    }
    #Url(url, searchParamName, searchParamValue) {
        url = url
            .replace(/\?+\s*/g, "?")
            .replace(/\s*&\s*/g, "&")
            .replace(/&+$/, "");
        const query =
            encodeURIComponent(searchParamName) + '=' +
            encodeURIComponent(searchParamValue);
        if (!url.includes("?")) {
            url += '?';
        } else if (!url.endsWith("?") && !url.endsWith("&")) {
            url += '&';
        }
        return url + query;
    }
    #load(container) {
        const el = this.#GetContainerElements(container);
        if (el.url != '') {
            //adding url parameter preserving any existings params
            const url = this.#Url(el.url, el.urlSearchParamName, el.input.value.trim());
            el.select.innerHTML = '';
            el.select.size = 0;
            el.select.style.width = container.clientWidth + 'px';
            el.hourglass.classList.remove("d-none");
            el.error.classList.add("d-none");
            el.error.classList.remove('bi-sign-do-not-enter,bi-exclamation-circle');
            this.#AddOption(el.select, '', '', el.input, el.description, el.Key);
            const xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.responseType = 'json';
            xhr.onreadystatechange = ()=> {
                if (xhr.readyState == 4) {
                    el.hourglass.classList.add("d-none");
                    switch (xhr.status) {
                        case 200:
                            if (xhr.response.length > 0) {
                                el.select.classList.remove("d-none");
                                xhr.response.forEach(item => {
                                    this.#AddOption(el.select, item[el.KeyField], item[el.descriptionField], el.input, el.description, el.Key);
                                });
                                el.select.size = xhr.response.length + 2;
                                el.select[0].selected = false;
                                el.select.style.zIndex = 100;
                            }
                            break;
                        case 401:
                            el.error.classList.add('bi-sign-do-not-enter');
                            el.error.classList.remove("d-none");
                            break;
                        default:
                            el.error.classList.add('bi-exclamation-circle');
                            el.error.classList.remove("d-none");
                    }
                }
            }
            xhr.send();
        }
    }
}
class SSDropdownLoader {
    constructor() {
        const containers = document.querySelectorAll('div[data-component="single-static-dropdown"]');
        containers.forEach(container => { 
            if (container.dataset.autoload.toLowerCase() != 'no') this.#Load(container);
        })
    }
    Save(context=null) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="single-static-dropdown"]' + filter);
        containers.forEach(container => {
            var datakeys = container.querySelectorAll('input[data-key]');
            datakeys.forEach(datakey => {
                datakey.value = datakey.dataset.key;
            });
        });
    }
    Restores(context=null) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="single-static-dropdown"]' + filter);
        containers.forEach(container => {
            var datakey = container.querySelector('input[data-key]');
            datakey.dataset.key = datakey.value;
            this.#UpdateCurrentIndex(container);
        });
    }
    Clear(context=null, removeElements = false) {
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="single-static-dropdown"]' + filter);
        containers.forEach(container => {
            var input = container.querySelector('input[type=text]');
            input.value = '';
            var datakey = container.querySelector('input[data-key]');
            datakey.value = '';
            datakey.dataset.key = '';
            if (removeElements) {
                var ul = container.querySelector('ul');
                ul.innerHTML = '';
            }
        });
    }
    Load(containerId, params = null, selectedKey = null) {
        const container = document.querySelector('div[data-component="single-static-dropdown"][id=' + containerId + ']');
        if (selectedKey != null) {
            const input = container.querySelector('input[type="hidden"][data-key]');
            input.value = selectedKey;
            input.dataset.key = selectedKey;
        }
        this.#Load(container, params);
    }
    GetKeyValue(containerId) {
        return document.getElementById(containerId).querySelector('input[type="hidden"][data-key]').value;
    }
    #BindEvents(container) {
        var items = container.querySelector('ul.dropdown-menu').querySelectorAll('a');
        var onItemclick = new Event('itemClick.2t.staticDropdownLoader', { bubbles: true, cancelable: true, composed: false });
        items.forEach(a => {
            a.onclick = function (e) {
                var ul = e.target.parentNode.parentNode;
                var div = ul.parentNode;
                var context = div.getAttribute('data-context');
                var button = div.querySelector('input[type="text"]');
                button.value = e.target.innerText.trim();
                var keyvalue = div.querySelector('input[type="hidden"][data-key]');
                keyvalue.dataset.key = e.target.getAttribute('value');
                var itemselected = ul.querySelector('a.active');
                if (itemselected != null) itemselected.classList.remove('active');
                e.target.classList.add('active');
                button.focus();
                onItemclick.context = context;
                onItemclick.value = e.target.getAttribute('value');
                document.dispatchEvent(onItemclick);
            }
        });
    }
    #UpdateCurrentIndex(container) {
        var btn = container.querySelector('input[type="text"]');
        var input = container.querySelector('input[type=hidden]');
        var a = container.querySelector('a.dropdown-item.active');
        if (a != null) a.classList.remove('active');
        a = container.querySelector('a.dropdown-item[value="' + input.dataset.ssdropdownKey + '"]');
        if (a == null) a = container.querySelector('a.dropdown-item[value=""]');
        if (a != null) {
            btn.value = a.innerText.trim();
            a.classList.add('active');
        } else btn.value = '';
    }
    #AddItem(ul, description, keyvalue) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.classList.add('dropdown-item');
        a.setAttribute('value', keyvalue);
        a.innerHTML = description;
        li.appendChild(a);
        ul.appendChild(li);
    }
    #Url(url, params = null) {
        url = url
        .replace(/\?+\s*/g, "?")
        .replace(/\s*&\s*/g, "&")
        .replace(/&+$/, "");
        if (params != null) {
            params = new URLSearchParams(params).toString();
            if (!url.includes("?")) {
                url += '?';
            } else if (!url.endsWith("?") && !url.endsWith("&")) {
                url += '&';
            }
            return url + params;
        } else return url;
    }
    #Load(container, params = null) {
        const xhr = new XMLHttpRequest();
        var uri = container.dataset.uri;
        uri = this.#Url(uri, params);
        const descFieldName = container.dataset.descriptionFieldname;
        const keyFieldName = container.dataset.keyFieldname;
        const hourglass = container.querySelector('img[data-role="hourglass"]');
        const error = container.querySelector('span[data-role="error"]');
        const ul = container.querySelector('ul.dropdown-menu');
        ul.innerHTML = '';
        xhr.open('get', uri);
        xhr.responseType = 'json';
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4) {
                hourglass.classList.add("d-none");
                switch (xhr.status) {
                    case 200:
                        var result = xhr.response;
                        if (result.length > 0) {
                            var input = container.querySelector('input[type=hidden][data-key]');
                            input.dataset.ssdropdownKey = input.value;
                            var firstSelected = (result.length == 1 && container.dataset.selectedIfSingleResult == 'yes');
                            if (!firstSelected) {
                                this.#AddItem(ul, '&nbsp;', '');
                                for (var i = 0; i < result.length; i++) { this.#AddItem(ul, result[i][descFieldName], result[i][keyFieldName]); }
                                this.#BindEvents(container);
                                this.#UpdateCurrentIndex(container);
                            }
                            else {
                                container.querySelector('input[type="text"]').value = result[0][descFieldName];
                                var keyvalue = container.querySelector('input[type="hidden"][data-key]');
                                keyvalue.value = result[0][keyFieldName];
                                keyvalue.dataset.key = result[0][keyFieldName];
                            }
                        }
                        break;
                    case 401:
                        error.classList.add('bi-sign-do-not-enter');
                        error.classList.remove("d-none");
                        break;
                    default:
                        error.classList.add('bi-exclamation-circle');
                        error.classList.remove("d-none");
                }
            }
        }
        error.classList.add('d-none');
        error.classList.remove('bi-sign-do-not-enter,bi-exclamation-circle');
        hourglass.classList.remove("d-none");
        xhr.send();
    }
}
class MSDropdownLoader {
    constructor() {
        const containers = document.querySelectorAll('div[data-component="multiple-static-dropdown"]');
        containers.forEach(container => {
            // example: <input type="hidden" data-key value='[5,6]' />
            // example: <input type="hidden" data-key value='["green","black"]' />
            const input = container.querySelector('input[type="hidden"][data-key]');
            input.value.trim();
            if (input.value == '') input.value = '[]';
            input.value = JSON.stringify(JSON.parse(input.value).map(String));
            input.dataset.key = input.value;
            if (container.dataset.autoload == 'yes') this.#Load(container);
        });
    }
    Save(context = null) {
        //update confirmed valute with temporary valu
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="multiple-static-dropdown"]' + filter);
        containers.forEach(container => {
            var datakey = container.querySelector('input[type="hidden"][data-key]');
            datakey.value = datakey.dataset.key;
        });
    }
    Restores(context = null) {
        //write temporary key value with last confirmed value 
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="multiple-static-dropdown"]' + filter);
        containers.forEach(container => {
            var datakey = container.querySelector('input[type="hidden"][data-key]');
            datakey.dataset.key = datakey.value;
            this.#Refresh(container);
        });
    }
    Clear(context = null, removeElements = false) {
        //set the temporary key to empty array
        const filter = context == null ? '' : '[data-context="' + context + '"]';
        const containers = document.querySelectorAll('div[data-component="multiple-static-dropdown"]' + filter);
        containers.forEach(container => {
            var datakey = container.querySelector('input[type=hidden][data-key]');
            datakey.dataset.key = '[]';
            if (removeElements) {
                var ul = container.querySelector('ul');
                ul.innerHTML = '';
            }
            this.#Refresh(container);
        });
    }
    Load(containerId, params = null, selectedKeys = null) {
        const container = document.querySelector('div[data-component="multiple-static-dropdown"][id="' + containerId + '"]');
        if (selectedKeys != null) {
            const input = container.querySelector('input[type="hidden"][data-key]');
            // If selectedKeys is already an Array type it is converted to an Array of strings if it is not already
            // and transformed into a string for assignment to the value property of the input element.
            // If it is an Array in string format it will be parserized into an Array of strings and then 
            // converted to a string for assignment to the value property of the input element. 
            switch (Array.isArray(selectedKeys)) {
                case true:
                    input.value = JSON.stringify(selectedKeys.map(String));
                    break;
                case false:
                    input.value = JSON.stringify(JSON.parse(selectedKeys).map(String));
                    break;
            }
            input.dataset.key = input.value;
        }
        this.#Load(container, params);
    }
    GetKeyValue(containerId) {
        //return the confirmed value
        return document.getElementById(containerId).querySelector('input[type="hidden"][data-key]').value;
    }
    #Url(url, params = null) {
        url = url
            .replace(/\?+\s*/g, "?")
            .replace(/\s*&\s*/g, "&")
            .replace(/&+$/, "");
        if (params != null) {
            params = new URLSearchParams(params).toString();
            if (!url.includes("?")) {
                url += '?';
            } else if (!url.endsWith("?") && !url.endsWith("&")) {
                url += '&';
            }
            return url + params;
        } else return url;
    }
    #Load(container, params = null) {
        function AddItem(ul, description, keyvalue, selectedKeys) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('href', '#');
            a.classList.add('dropdown-item');
            var ck = document.createElement('input');
            ck.setAttribute('type', 'checkbox');
            ck.classList.add('form-check-input', 'me-2');
            keyvalue = String(keyvalue);
            ck.setAttribute('value', keyvalue);
            if (SelectedKeys.length > 0 && selectedKeys.includes(keyvalue)) ck.setAttribute('checked','');
            a.innerHTML = ck.outerHTML + description;
            li.appendChild(a);
            ul.appendChild(li);
            return ck.checked;
        }
        const xhr = new XMLHttpRequest();
        const uri = this.#Url(container.getAttribute('data-uri'), params);
        const descFieldName = container.dataset.descriptionFieldname;
        const keyFieldName = container.dataset.keyFieldname;
        const hourglass = container.querySelector('i[data-role="hourglass"]');
        const ul = container.querySelector('ul.dropdown-menu');
        const input = container.querySelector('input[type="hidden"][data-key]');
        const error = container.querySelector('span[data-role="error"]');
        const SelectedKeys = JSON.parse(input.value); // read saved keys
        ul.innerHTML = '';
        xhr.open('get', uri);
        xhr.responseType = 'json';
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4) {
                hourglass.classList.add("d-none");
                switch (xhr.status) {
                    case 200:
                        var count = 0;
                        xhr.response.forEach(item => {
                            if (AddItem(ul, item[descFieldName], item[keyFieldName], SelectedKeys)) count++;
                        })
                        //primary color for button if some element is checked
                        const btn = container.querySelector('button');
                        const counter = container.querySelector('span[data-role="counter"]');
                        counter.innerText = '';
                        btn.classList.remove("btn-secondary", "btn-primary");
                        if (count > 0) {
                            btn.classList.add("btn-primary");
                            counter.innerText = '(' + count + ')';
                        } else btn.classList.add("btn-secondary");
                        // prevent the close of the container 
                        ul.querySelectorAll('li').forEach(item => {
                            var a = item.children[0];
                            a.onclick = (e) => {
                                if (e.target.type != 'checkbox') {
                                    var ck = e.target.querySelector('input[type=checkbox]');
                                    ck.checked = !ck.checked;
                                    this.#UpdateTemporaryKey(container, ck.checked, ck.value);
                                    e.preventDefault();
                                    e.stopPropagation();
                                } else this.#UpdateTemporaryKey(container, e.target.checked, e.target.value);
                            }
                        })
                        break;
                    case 401:
                        error.classList.add('bi-sign-do-not-enter');
                        error.classList.remove("d-none");
                        break;
                    default:
                        error.classList.add('bi-exclamation-circle');
                        error.classList.remove("d-none");
                }
            }
        }
        error.classList.add('d-none');
        error.classList.remove('bi-sign-do-not-enter,bi-exclamation-circle');
        hourglass.classList.remove("d-none");
        xhr.send();
    }
    #UpdateTemporaryKey(container, checked, value) {
        const counter = container.querySelector('span[data-role="counter"]');
        const keys = container.querySelector('input[type="hidden"][data-key]');
        const btn = container.querySelector('button');
        if (!keys) return;
        const array = JSON.parse(keys.dataset.key);
        value = String(value);
        if (checked) {
            if (!array.includes(value)) {
                array.push(value);
            }
        } else {
            const index = array.indexOf(value);
            if (index !== -1) {
                array.splice(index, 1);
            }
        }
        keys.dataset.key = JSON.stringify(array);
        counter.innerText = '';
        btn.classList.remove("btn-secondary", "btn-primary");
        // We count all input elements type="checkbox" inside the container that have the checked attribute.
        // It would have been easier to check the length of the "array" variable containing the selected keys but it may not represent
        // just the totality of one-to-one matches between the values assigned to the value properties of each checkbox and the list of
        // loaded keys  due either to an error in the query design or to a mere architectural choice wanting to hide one or more keys
        // that cannot be managed directly by the user but are attested by business logic.
        const cks = container.querySelectorAll('input[type="checkbox"]:checked');
        if (cks.length > 0) {
            btn.classList.add("btn-primary");
            counter.innerText = '(' + cks.length + ')';
        } else btn.classList.add("btn-secondary");
    }
    #Refresh(container) {
        //set checkbox state from the temporary key
        var selectedKeys = container.querySelector('input[type="hidden"][data-key]').dataset.key;
        selectedKeys = JSON.parse(selectedKeys);
        const cks = container.querySelectorAll('input[type="checkbox"]');
        const counter = container.querySelector('span[data-role="counter"]');
        counter.innerText = '';
        var count = 0;
        cks.forEach(ck => {
            ck.checked = selectedKeys.includes(ck.value);
            if (ck.checked) count++;
        })
        //primary color for button if some element is checked
        var btn = container.querySelector('button');
        btn.classList.remove("btn-secondary", "btn-primary");
        if (count > 0) {
            btn.classList.add("btn-primary");
            counter.innerText = '(' + count + ')';
        } else btn.classList.add("btn-secondary");
    }
}
