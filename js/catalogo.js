


//if the data gets too big, consider ajax loading
var tabledata = []
if(window.PHP_GLOBALS && window.PHP_GLOBALS.table){
  tabledata = window.PHP_GLOBALS.table
}


var apiUrl = "api/"
function update(endpoint, data){
  var url = apiUrl + endpoint + ".php"

  var ret = ""
  first = true;
  for ( var key in data ) {
    if(first)
      first = false;
    else
      ret += "&"
    ret += key + "=" + data[key]

  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(ret);

}

function $(id){
 return document.getElementById(id)
}

var biggestID = 0;
if(tabledata.length > 0)
  biggestID = tabledata[tabledata.length-1].id
// for(var row in tabledata){
//   if()
// }

var form = document.getElementById("addform")
form.addEventListener("submit", addRow)
function addRow(e){
  biggestID ++;
  var computedId = biggestID;
  var row = {
    id: computedId,
    titolo: $("titolo").value,
    autore: $("autore").value,
    casa_ed: $("casa_ed").value,
    argomento: $("argomento").value,
    note: $("note").value,
  }
  window.table.addRow(row, true);
  form.reset()
  e.preventDefault();
}

var selectedRows = [];
function manageSelection(data, rows){
  selectedRows = rows;
  if(data.length > 0){
    //make ui visible
    $("selectmenu").classList.remove("hidden")
    $("countview").innerText = data.length
  }
  else{
    //hide ui
    $("selectmenu").classList.add("hidden")
  }
}

$("delete").addEventListener("click", deleteRows)
function deleteRows(){
  for(row of selectedRows){
    row.delete()
  }
  selectedRows = [];
  manageSelection([],[]);
}

//TODO: ajax load everything, and add headerfilter parameters to the data
//initialize table
var table = new Tabulator("#table", {
  data:tabledata, //assign data to table
  // autoColumns:true, //create columns from data field names

  selectable:true,

  pagination:"local",
  paginationSize:12,
  // paginationSizeSelector:[6, 12, 50],

  layout: "fitDataTable",
  layout: "fitColumns",
  responsiveLayout:"collapse",

  columns:[
    {title:"ID", field:"id", width: "60", sorter:"number"},
    {title:"Titolo", field:"titolo", sorter:"string", headerFilter:true, editor:"input", validator:"required"},
    {title:"Autore", field:"autore", sorter:"string", headerFilter: true, editor:"input", validator:"required"},
    {title:"Casa editrice", field:"casa_ed", sorter:"string",headerFilter:true, editor:"input", validator:"required"},
    {title:"Argomento", field:"argomento", sorter:"string",headerFilter:true , editor:"input", validator:"required"},
    {title:"Note", field:"note", sorter:"string",headerFilter:true, editor:"input"},
  ],

  cellEdited:function(cell){
    //cell - cell component
    console.log("cell")
    console.log(cell.getData())
    update("update", cell.getData())
  },
  rowAdded:function(row){
    //row - row component
    console.log("rowadded")
    console.log(row.getData())
    update("add",row.getData())
  },
      rowSelectionChanged: manageSelection,

  placeholder:"Non hai ancora aggiunto nessun libro!",
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

