
//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
 }

//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }

    return true; //must return a boolean, true if it passes the filter.
}









//define data array
var tabledata = [
    // {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1},
    // {id:2, name:"Mary May", progress:1, gender:"female", rating:2, col:"blue", dob:"14/05/1982", car:true},
    // {id:3, name:"Christine Lobowski", progress:42, gender:"female", rating:0, col:"green", dob:"22/05/1982", car:"true"},
    // {id:4, name:"Brendon Philips", progress:100, gender:"male", rating:1, col:"orange", dob:"01/08/1980"},
    // {id:5, name:"Margret Marmajuke", progress:16, gender:"female", rating:5, col:"yellow", dob:"31/01/1999"},
    // {id:6, name:"Frank Harbours", progress:38, gender:"male", rating:4, col:"red", dob:"12/05/1966", car:1},
    {id:1, titolo: "i promessi sposi", autore:"manzoni", casa_ed:"einaudi", argomento:"romanzo", note: "copertina rigida rotta"},
    {id:2, titolo: "la divina commedia", autore:"dante alighieri", casa_ed:"LDM", argomento:"commedia", note: ""},
    {id:3, titolo: "se questo è un uomo", autore:"primo levi", casa_ed:"einaudi", argomento:"romanzo", note: ""},
    {id:4, titolo: "i promessi topi", autore:"romano scarpa", casa_ed:"disney", argomento:"fumetto", note: ""},
    {id:5, titolo: "quiz esami patente", autore:"sIDA", casa_ed:"sIDA", argomento:"manuale", note: ""},
    {id:6, titolo: "1984", autore:"g orwell", casa_ed:"zanichelli", argomento:"romanzo", note: ""},
];

//TODO: ajax load everything, and add headerfilter parameters to the data
//initialize table
var tabl = new Tabulator("#table", {
    data:tabledata, //assign data to table
    // autoColumns:true, //create columns from data field names

    pagination:"local",
    paginationSize:12,
    // paginationSizeSelector:[6, 12, 50],

    layout: "fitDataTable",
     layout: "fitColumns",
     responsiveLayout:"collapse",

     columns:[
       // {title:"ID", field:"id", hozAlign:"center", sorter:"date",  headerFilter:"input"},
       // {title:"Titolo", field:"titolo", width:150, headerFilter:"input"},
       // {title:"Autore", field:"autore", width:150, formatter:"progress", sorter:"number", headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction, headerFilterLiveFilter:false},
       // {title:"Casa editrice", field:"casa_ed", editor:"select", editorParams:{values:{"male":"Male", "female":"Female"}}, headerFilter:true, headerFilterParams:{values:{"male":"Male", "female":"Female", "":""}}},
       // {title:"Argomento", field:"argomento", editor:"star", hozAlign:"center", width:100, headerFilter:"number", headerFilterPlaceholder:"at least...", headerFilterFunc:">="},
       // {title:"Note", field:"note", editor:"input", headerFilter:"select", headerFilterParams:{values:true}},

       {title:"ID", field:"id", width: "60", sorter:"number"},
       {title:"Titolo", field:"titolo", sorter:"string", headerFilter:true},
       {title:"Autore", field:"autore", sorter:"string", headerFilter: true},
       {title:"Casa editrice", field:"casa_ed", sorter:"string",headerFilter:true},
       {title:"Argomento", field:"argomento", sorter:"string",headerFilter:true},
       {title:"Note", field:"note", sorter:"string",headerFilter:true},
     ],


     locale: "it-it",
     langs: {
       "it-it": {
            // "columns":{
            //     "name":"Nom",
            //     "progress":"Progression",
            //     "gender":"Genre",
            //     "rating":"Évaluation",
            //     "col":"Couleur",
            //     "dob":"Date de Naissance",
            // },
            "pagination":{
                "first":"prima",
                "first_title":"prima pagina",
                "last":"ultima",
                "last_title":"ultima pagina",
                "prev":"precedente",
                "prev_title":"pagina precendente",
                "next":"successiva",
                "next_title":"pagina successiva",
                "all":"tutte",
            },
            "headerFilters":{
                "default":"filtra nella colonna", //default header filter placeholder text
                "columns":{
                    "titolo":"filtra per titolo", //replace default header filter text for column name
                    "autore":"filtra per autore", //replace default header filter text for column name
                    "casa_ed":"filtra per casa editrice", //replace default header filter text for column name
                    "argomento":"filtra per argomento", //replace default header filter text for column name
                    "note":"cerca nelle annotazioni", //replace default header filter text for column name
                }
            }

       },
        "en-gb":{
            "columns":{
                "name":"Name", //replace the title of column name with the value "Name"
            },
            "ajax":{
                "loading":"Loading", //ajax loader text
                "error":"Error", //ajax error text
            },
            "groups":{ //copy for the auto generated item count in group header
                "item":"item", //the singular  for item
                "items":"items", //the plural for items
            },
            "pagination":{
            	"page_size":"Page Size", //label for the page size select element
                "page_title":"Show Page",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
                "first":"First", //text for the first page button
                "first_title":"First Page", //tooltip text for the first page button
                "last":"Last",
                "last_title":"Last Page",
                "prev":"Prev",
                "prev_title":"Prev Page",
                "next":"Next",
                "next_title":"Next Page",
                "all":"All",
            },
            "headerFilters":{
                "default":"filter column...", //default header filter placeholder text
                "columns":{
                    "name":"filter name...", //replace default header filter text for column name
                }
            }
        }
     }
});
