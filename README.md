# Dropdownlist

# **1	Introduzione**

Gli elenchi a discesa sono generalmente utilizzati sia all’interno degli scenari di ricerca che per l’inserimento dati.
Tra le molteplici famiglie di elenchi noi abbiamo deciso di standardizzarne 3 ovvero quelle che con maggior frequenza integriamo all’interno dei nostri progetti:

## **-  Dynamic Dropdown Loader**

<img width="399" height="174" alt="image-01" src="https://github.com/user-attachments/assets/73b315fc-8776-4249-811f-10417751943b" />

## **-  Single Static Dropdown Loader**
  
<img width="248" height="220" alt="image-02" src="https://github.com/user-attachments/assets/8932e849-41d7-4d62-a325-06b35d263386" />

## **-	Multiple Static dropdown**

<img width="306" height="250" alt="image-03" src="https://github.com/user-attachments/assets/d7a0d803-079f-4de1-8440-dea43676cb4c" />

I tre controlli sono stati pensati e realizzati per operare sia all’interno di scenari di ricerche che per l’inserimento dati e sono caratterizzati da interfacce pubbliche simili al fine di uniformarne e semplificarne l’utilizzo.
La logica di recupero delle scelte effettuate dall’utente è di tipo a doppio stato. In breve, quando l’utente effettua la sua scelta (che sia singola o multipla) questa viene temporaneamente memorizzata in proprietà specializzate di elementi html di tipo input type=”hidden” rimanendovi fintantoché non venga sovrascritta, ripristinata o cancellata da altra azione. Ecco un esempio esplicativo applicato alla Single Static Dropdown Loader.

<img width="211" height="187" alt="image-04" src="https://github.com/user-attachments/assets/d73ee506-f39e-434e-8498-91566dcf8396" />

In questo semplice esempio, i valori di chiave e descrizione coincidono. 
```html
<ul>
    <li><a href="#">&nbsp;</a></li>
    <li><a href="#">2026</a></li>
    <li><a href="#">2022</a></li>
</ul>
```

La struttura viene generata dinamicamente durante l’interrogazione del servizio web dedicato durante il caricamento della pagina o in un momento successivo.
A ciascun elemento html di tipo “a” viene aggiunta dinamicamente una nuova proprietà “value” assegnandole il valore della chiave dell’item corrispondente:

```html
<ul>
    <li><a href="#" value=””>&nbsp;</a></li>
    <li><a href="#" value=”2026”>2026</a></li>
    <li><a href="#" value=”2022”>2022</a></li>
</ul>
```

I valori della chiave attuale e di quella temporanea vengono invece salvati all’interno dell’elemento

<input type="hidden" data-key=”2026” value=”2026” />

Supponiamo che ora l’utente selezioni dal menu a discesa il valore “2022”. Il nuovo stato dell’elemento hidden sarà il seguente: 
```html
<input type="hidden" data-key=”2022” value=”2026” />
``` 
Per cristallizzare, ripristinare o eliminare la scelta effettuata dall’utente tutti e tre i controlli Javascript espongono i seguenti metodi pubblici:
**Save**(context=null) salva la scelta dell’utente;
**Restores**(context=null) ripristina la scelta precedentemente salvata;
**Clear**(context=null) resetta il controllo;
Facendo riferimento al nostro esempio ecco quale impatto avrebbe l’invocazione dei tre metodi sulla seguente configurazione: 
```html
<input type="hidden" data-key=”2022” value=”2026” />
```
<img width="212" height="165" alt="image-05" src="https://github.com/user-attachments/assets/6b299353-914f-4d80-8066-c49a0a2937ed" />

Invocando il metodo **Restores**(context=null) otterremo il seguente risultato:
```html
<input type="hidden" data-key=”2026” value=”2026” />
```
<img width="211" height="187" alt="image-06" src="https://github.com/user-attachments/assets/da85d7b4-097c-4e90-9301-ffe2bd5fcd3a" />

Invocando il metodo **Save**(context=null) otterremo il seguente risultato:
```html
<input type="hidden" data-key=”2022” value=”2022” />
```
<img width="212" height="165" alt="image-07" src="https://github.com/user-attachments/assets/962eb470-27a0-4ff4-aca6-7f81f1c912b8" />

Invocando il metodo **Clear**(context=null) otterremo il seguente risultato:
```html
<input type="hidden" data-key=”” value=”” />
```
<img width="219" height="166" alt="image-08" src="https://github.com/user-attachments/assets/c366a09d-e3b4-458d-812d-c6849e817de5" />

Dal punto di vista generale, la fonte dati attesa dai nostri controlli è rappresentata da servizi web basati su metodi http Get.
Le strutture html dei tre controlli sono state progettate e realizzate per integrarsi perfettamente con il framework Bootstrap 5.3x e Bootstrap icons e semplificano sia la progettazione di scenari gestionali a singola pagina che misti come pure l'integrazione all'interno di viste Asp.net core Razor.


# **2	Dinamic Dropdown Loader**

Recupera dinamicamente un elenco di record costituiti da una chiave e una descrizione come, ad esempio,

**[{“description”: “Rosso”,”key”: 125},{“description”: “Verde”,”key”: 90},………]**

mentre l’utente digita nell’elemento input di tipo text individuato dall’attributo data-role=”editor”. 
Nella struttura sottostante al campo di input è stata assegnata la proprietà required per mostrare l’operatività del sistema di validazione formale. 

### <u><strong>Struttura Html del controllo</strong></u>

```html

<div class="row">
    <div class="col-7 col-md-5 col-lg-4">
        <label for="" class="form-label">Prodotti e servizi</label>
        <div class="ddropdown input-group"
                data-component="dinamic-dropdown"
                data-context=""
                data-description-field="description"
                data-Key-field="key"
                data-url-search-param-name="description"
                data-url="/Offers/ElencoProdottiServizi">
            <span class="input-group-text">@@</span>
            <input type="text" class="form-control" autocomplete="off" required data-role="editor" />
            <img class="hourglass hourglass-sm d-none" data-role="hourglass" />
            <span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
            <input name="description" type="hidden" data-description value="@ViewBag.description" />
            <input name="key" type="hidden" data-key value="@ViewBag.key" />
            <div class="valid-feedback">
                Looks good!
            </div>
            <div class="invalid-feedback">
                Looks bad!
            </div>
        </div>
        <select class="form-select d-none overflow-auto" data-role="dinamic-dropdown-items"></select>
    </div>
</div>

```

Il contenitore del controllo è rappresentato da un elemento div caratterizzato dalla proprietà data-component = “dinamic-dropdown” e i seguenti ulteriori attributi:

<img width="845" height="228" alt="image-10" src="https://github.com/user-attachments/assets/ad121011-a599-4c42-92db-05eb3a4c9443" />

Descriviamo ora, nell’ordine, gli altri elementi funzionali html del controllo.

<img width="848" height="673" alt="image-11" src="https://github.com/user-attachments/assets/2ba0c0ce-0a37-4b5a-ba66-1eeb654189fc" />

### <u><strong>Javascript class DDropdownLoader</strong></u>
```javascript
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

```
### <u><strong>MVC View example</strong></u>
```html
<form method="post" asp-action="Index" asp-controller="Home" class="needs-validation">
    <div class="row">
        <div class="col-7 col-md-5 col-lg-4">
            <label class="form-label">Prodotti e servizi</label>
            <div class="ddropdown input-group" id="test"
                    data-component="dinamic-dropdown"
                    data-context=""
                    data-description-field="description"
                    data-Key-field="key"
                    data-url-search-param-name="description"
                    data-url="/Offers/ElencoProdottiServizi">
                <span class="input-group-text">@@</span>
                <input type="text" class="form-control" autocomplete="off" required data-role="editor" />
                <img class="hourglass hourglass-sm d-none" data-role="hourglass" />
                <span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
                <input name="description" type="hidden" data-description value="@ViewBag.description" />
                <input name="key" type="hidden" data-key value="@ViewBag.key" />
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Looks bad!
                </div>
            </div>
            <select class="form-select d-none overflow-auto" data-role="dinamic-dropdown-items"></select>
        </div>
    </div>

    <input type="submit" value="save" onclick="dd.Save()" />
    <input type="button" value="clear" onclick="dd.Clear()" />
    <input type="button" value="restores" onclick="dd.Restores()" />
    <input type="button" value="set url" onclick="dd.WriteUrl('test','/Offers/ElencoProdottiServizi')" />
    <input type="button" value="clear url" onclick="dd.WriteUrl('test','')" />
    <input type="button" value="writeKeyAndDescription" onclick="dd.SetKeyAndDescription('test','12','Sopralluogo')" />
    <input type="button" value="GetKeyAndDescriptioValues" onclick="var r = dd.GetKeyAndDescriptioValues('test'); alert(r.key + ' ' + r.description)" />

</form>

@section Scripts { 
    <script>
        const dd = new DDropdownLoader();
    </script>
}
```
### <u><strong>Operatività del controllo</strong></u>
Il costruttore della classe ricerca tutti i container con proprietà data-component="dinamic-dropdown" ed esegue su di essi due principali azioni: 
- imposta l'eventuale valore iniziale (chiave, descrizione) si veda esempio precedente con l'assegnazione value="@ViewBag.description" e value="@ViewBag.key"
- assegna all'elemento input di tipo text e proprietà data-role="editor" un gestore per ciacuno dei seguenti eventi: blur, keydown, keyup, cut, paste e dblclick.
Tutti i citati gestori, con la sola eccezione del blur e keydown, avviano la chiamata al servizio web dedicato. 
Il gestore dell'evento blur verifica invece la scomparsa dell'elenco dei risultati recuperando l'ultima descrizione valida derivata da un "clcik" dell'utente su un item dell'elenco.

Alcune considerazioni sulla proprietà data-url del container.
Nel nostro esempio data-url="/Offers/ElencoProdottiServizi" non ha parametri ma è del tutto ragionevole ipotizzare che possa averne, es.:

data-url="/Offers/ElencoProdottiServizi?category=100".

Nel metodo privato #load(container){...} viene garantita l'integrità degli eventuali parametri preesistenti aggiungendovi dinamicamente quello relativo alla descrizione oggetto della richiesta quindi, facendo riferimento al nostro esempio, avremo:

<u>url = "/Offers/ElencoProdottiServizi?category=100&description=hotel"</u>

Il controllo è immediatamente pronto a interagire con l'utente ma cosa fare quando tale interazione invece non deve avvenire prima che un'altro processo generi un parametro url essenziale?
In altre parole, supponiamo che il parametro <strong>category</strong> provenga da una scelta dinamica effettuata dall'utente, per esempio, selezionando una categoria merceologica da un elenco a discesa.
In questo caso si assegni data-url="" e si utilizzi il metodo pubblico WriteUrl(containerId, url) con l'url completo:

```javascript
<script>
        const dd = new DDropdownLoader();
        document.addEventListener('onCategorySelected',(e)=>{ dd.WriteUrl(containerId, "/Offers/ElencoProdottiServizi?category=" + e.category)})
</script>
```

# **3	Single Static Dropdown Loader**

<img width="248" height="220" alt="image-02" src="https://github.com/user-attachments/assets/8932e849-41d7-4d62-a325-06b35d263386" />

Recupera da un apposito servizio web un elenco di record costituiti da una chiave e una descrizione come, ad esempio,

**[{“description”: “Rosso”,”key”: 125},{“description”: “Verde”,”key”: 90},………]**

e memorizza la scelta effettuata dall'utente.

Sulla scorta del valore assegnato all'attributo data-autoload del container il caricamento verrà effettuato o in fase di istanzazione della classe oppure successivamente tramite Javascript:
- data-autoload="yes" => caricamento in fase di istanzazione della classe;
- data-autoload="no" => invocando successivamente il metodo pubblico Load(containerId, params = null).

### <u><strong>Struttura Html del controllo</strong></u>

```html

<div class="row">
    <div class="col">
        <label class="form-label user-select-none">Esercizio</label>
        <div class="ssdropdown dropdown input-group"
                data-component="single-static-dropdown"
                data-bs-toggle="dropdown"
                data-selected-if-single-result="no"
                data-autoload="yes"
                data-uri="/Offers/EserciziOfferte"
                data-description-fieldname="esercizio"
                data-key-fieldname="esercizio"
                data-context="">
            <input type="text"
                    readonly
                    autocomplete="off"
                    class="form-control bg-white user-select-none no-focus"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false" />
            <span class="input-group-text dropdown-toggle" role="button"></span>
            <ul class="dropdown-menu"></ul>
            <input type="hidden" value="@ViewBag.Anno" data-key="" />
        <!--<input type="hidden" asp-for="@Model.Anno" data-key="" /> -->
            <img class="hourglass hourglass-sm d-none" data-role="hourglass" />
        </div>
    </div>
</div>


```
La logica a doppio stato della scelta effettuata dall'utente è la stessa ma la sua implementazione è molto più semplice.
Poiché le descrizioni degli items non possono essere modificate dall'utente, il quale può solo sceglierne una tra quelle proposte, la chiave è il solo valore che dobbiamo memorizzare.
 
### <u><strong>Javascript class SSDropdownLoader</strong></u>
```javascript

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
    Load(containerId, params = null) {
        const container = document.querySelector('div[data-component="single-static-dropdown"][id=' + containerId + ']');
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
        const ul = container.querySelector('ul.dropdown-menu');
        ul.innerHTML = '';
        xhr.open('get', uri);
        xhr.responseType = 'json';
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
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
                        else
                        {
                            container.querySelector('input[type="text"]').value = result[0][descFieldName];
                            var keyvalue = container.querySelector('input[type="hidden"][data-key]');
                            keyvalue.value = result[0][keyFieldName];
                            keyvalue.dataset.key = result[0][keyFieldName];
                        }
                    }
                }
                hourglass.classList.add("d-none");
            }
        }
        hourglass.classList.remove("d-none");
        xhr.send();
    }
}

```
