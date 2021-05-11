


//fetch the books data from php
//if the data gets too big, consider ajax loading
var tabledata = []
if(window.PHP_GLOBALS && window.PHP_GLOBALS.table){
  tabledata = window.PHP_GLOBALS.table
}

errMessageTimer = null;
errMessage = null;
function errorMessage(text){
  removeErrMessage();
  clearTimeout(errMessageTimer)
  errMessageTimer = setTimeout(removeErrMessage, 5000)
  errMessage = document.createElement("div")
  errMessage.className = "message"
  let myAlert = document.createElement("p");
  myAlert.setAttribute("role", "alert");
  let myAlertText = document.createTextNode(text);
  myAlert.appendChild(myAlertText);
  errMessage.appendChild(myAlert)
  document.body.appendChild(errMessage);
}
function removeErrMessage(){
  if(errMessage){
    errMessage.remove()
  }
}

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
// used to recognize similarities in book entries
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * api endpoint
 */
function update(endpoint, data){
  var apiUrl = "api/"
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
  xhr.addEventListener("load", reqListener);
  function reqListener () {
      var resp = (this.responseText);
      if(!resp || resp.length == 0){
        errorMessage("Cè stato un problema durante il salvataggio dell'ultimo dato")
      }
      //else if(resp)
  }
}

/**
 * jquery-like utility function 
 */
function $(id){
 return document.getElementById(id)
}


//variables used by the form callback
var biggestID = 0;
if(tabledata.length > 0)
  biggestID = tabledata[tabledata.length-1].id
var form = document.getElementById("addform")
//form callback
form.addEventListener("submit", addRow)
function addRow(e){
  e.preventDefault();
  //prepare the data to insert
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
  //check if the imputted data is too similar to other data in the db
  var isTooSimilar = false;
  var similarInTable = window.table.getData('active')
  if(similarInTable && similarInTable.length > 0){
    isTooSimilar = similarInTable.some(function(currentRow){
      return ['titolo', 'autore', 'casa_ed'].every(function(e){
        return similarity(row[e], currentRow[e]) >= 0.8;
      })
    })
  }

  if(isTooSimilar){
    alert("questo libro risulta già presente nella raccolta")
  }
  else{
    window.table.addRow(row, true);
    form.reset()
  }

}

['titolo', 'autore', 'casa_ed'].forEach(function(field){
  $(field).addEventListener("change", function(e){
    console.log(e.target.value)
    console.log(window.table.setHeaderFilterValue(field, e.target.value));
  })
})


//delete selected row button callback
$("delete").addEventListener("click", deleteRows)
function deleteRows(){
  for(row of selectedRows){
    var idCell = row.getCell("id").getValue()
    update("remove", {id: idCell})
    row.delete()
  }
  selectedRows = [];
  manageSelection([],[]);
}

//selected rows tabulator callback
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


//initialize table
var table = new Tabulator("#table", {
  data:tabledata, //assign data to table

  // selectable:true,

  pagination:"local",
  paginationSize:12,
  // paginationSizeSelector:[6, 12, 50],

  layout: "fitDataTable",
  layout: "fitColumns",
  responsiveLayout:"collapse",

  columns:[
    {title:"ID", field:"id", width: "80", sorter:"number",
      cellClick:function(e, cell){
        cell.getRow().toggleSelect();
      }
    },
    {title:"Titolo", field:"titolo", sorter:"string", headerFilter:true, editor:"input", validator:"required"},
    {title:"Autore", field:"autore", sorter:"string", headerFilter: true, editor:"input", validator:"required"},
    {title:"Casa editrice", field:"casa_ed", sorter:"string",headerFilter:true, editor:"input", validator:"required"},
    {title:"Argomento", field:"argomento", sorter:"string",headerFilter:true , editor:"input", validator:"required"},
    {title:"Note", field:"note", sorter:"string",headerFilter:true, editor:"input"},
  ],

  cellEdited:function(cell){
    update("update", cell.getData())
  },

  rowAdded:function(row){
    update("add",row.getData())
  },

  rowSelectionChanged: manageSelection,

  placeholder:"Nessun libro trovato",
  locale: "it-it",
  langs: {
    "it-it": {
      "columns":{
        "name":"Name", //replace the title of column name with the value "Name"
      },
      "ajax":{
        "loading":"Caricamento..", //ajax loader text
        "error":"Errorenel caricamento", //ajax error text
      },
      "groups":{ //copy for the auto generated item count in group header
        "item":"elemento", //the singular  for item
        "items":"elementi", //the plural for items
      },
      "pagination":{
        "page_size":"dimensione di una pagina", //label for the page size select element
        "page_title":"Mostra pagina",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
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
  }
});

