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

### <u><strong>Struttura Html</strong></u>

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
                data-url="/Offers/ElencoProdottiServizi2">
            <span class="input-group-text">@@</span>
            <input type="text" class="form-control" autocomplete="off" required data-role="editor" />
            <img class="hourglass hourglass-sm d-none" data-role="hourglass" />
            <span class="bi ms-2 mt-auto mb-auto p-0 text-danger d-none" data-role="error"></span>
            <input type="hidden" data-description value="" />
            <input type="hidden" data-key value="" />
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





