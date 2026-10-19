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
                var Description = div.querySelector("input[type='hidden'][data-description]");
                var TabPressed = this.#IsTabPressed();
                var PointerOver = this.#IsPointerOver(select);
                if ((TabPressed) || (TabPressed == false && PointerOver == false)) {
                    var input = div.querySelector("input[type='text']");
                    if (input.value != Description.dataset.description) {
                        input.value = Description.dataset.description;
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
                var Description = div.querySelector("input[type='hidden'][data-description]");
                div.querySelector("input[type='text']").value = Description.dataset.description;
                if (!e.target.classList.contains("d-none")) e.target.classList.add("d-none");
                e.target.innerHTML = '';
            });
            //keydown event
            input.addEventListener('keydown', (e)=> { this.#TabPressed = (e.which == 9) });
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
            datakey.value = datakey.dataset.Key;
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
    SetKeyAndDescription(containerId, keyValue, descriptionValue) {
        const div = document.getElementById(containerId);
        const key = div.querySelector("input[type='hidden'][data-key]");
        const description = div.querySelector("input[type='hidden'][data-description]");
        const input = div.querySelector('input[type="text"][data-role="editor"]');
        key.dataset.key = keyValue;
        description.dataset.description = descriptionValue;
        //show initial description
        input.value = descriptionValue;
    }
    #GetContainerElements(container) {
        const input = container.querySelector('input[type="text"][data-role="editor"]');
        const Description = container.querySelector("input[type='hidden'][data-description]");
        const Key = container.querySelector("input[type='hidden'][data-Key]");
        const descriptionField = container.dataset.descriptionField;
        const KeyField = container.dataset.keyField;
        const UrlSearchParamName = container.dataset.urlSearchParamName;
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
            KeyField: KeyField,
            UrlSearchParamName: UrlSearchParamName,
            Description: Description,
            Key: Key
        }
    }
    #IsTabPressed() {
        var Pressed = this.#TabPressed;
        this.#TabPressed = false;
        return Pressed;
    }
    #IsPointerOver(element) {
        if (this.#MouseX < 0 || this.#MouseY < 0) return false;
        const elementUnderPointer = document.elementFromPoint(this.#MouseX, this.#MouseY);
        return elementUnderPointer === element || element.contains(elementUnderPointer);
    }
    #AddOption(select, keyvalue, descriptionvalue, input, Description, Key) {
        var option = document.createElement("option");
        option.setAttribute("key", keyvalue);
        option.innerHTML = descriptionvalue;
        option.onclick = function (e) {
            e.stopPropagation();
            Description.dataset.description = e.target.innerText; 
            Key.dataset.Key = e.target.getAttribute("key");
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
            const url = this.#Url(el.url, el.UrlSearchParamName, el.input.value.trim());
            el.select.innerHTML = '';
            el.select.size = 0;
            el.select.style.width = container.clientWidth + 'px';
            el.hourglass.classList.remove("d-none");
            el.error.classList.add("d-none");
            el.error.classList.remove('bi-sign-do-not-enter,bi-exclamation-circle');
            this.#AddOption(el.select, '', '', el.input, el.Description, el.Key);
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
                                    this.#AddOption(el.select, item[el.KeyField], item[el.descriptionField], el.input, el.Description, el.Key);
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
