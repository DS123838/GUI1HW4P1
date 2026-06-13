
/* custom validation methods */
$.validator.addMethod("lessThanOrEqualTo", function(value, element, param) {
    return parseInt(value, 10) <= parseInt($(param).val(), 10);
  });
  $.validator.addMethod("greaterThanOrEqualTo", function(value, element, param) {
    return parseInt(value, 10) >= parseInt($(param).val(), 10);
  });

  var fields = [
    { id: "colMin", label: "Minimum column value", cmpRule: "lessThanOrEqualTo",    cmpField: "#colMax" },
    { id: "colMax", label: "Maximum column value", cmpRule: "greaterThanOrEqualTo", cmpField: "#colMin" },
    { id: "rowMin", label: "Minimum row value",    cmpRule: "lessThanOrEqualTo",    cmpField: "#rowMax" },
    { id: "rowMax", label: "Maximum row value",    cmpRule: "greaterThanOrEqualTo", cmpField: "#rowMin" }
  ];
   
  var rules = {}, messages = {};
  $.each(fields, function(i, f) {
    var isMin  = (f.cmpRule === "lessThanOrEqualTo");
    var paired = isMin ? "maximum" : "minimum";
   
    rules[f.id] = { required: true, number: true, min: -50, max: 50 };
    rules[f.id][f.cmpRule] = f.cmpField;
   
    messages[f.id] = {
      required: f.label + " is required. Please enter a number between -50 and 50.",
      number: f.label + " must be a whole number (e.g. -5, 0, 12).",
      min: f.label + " must be at least -50. Please enter a value between -50 and 50.",
      max: f.label + " cannot exceed 50. Please enter a value between -50 and 50."
    };
    messages[f.id][f.cmpRule] = f.label + " must be " +
      (isMin ? "less than or equal to the maximum" : "greater than or equal to the minimum") +
      ". Please " + (isMin ? "decrease this value or increase" : "increase this value or decrease") +
      " the " + paired + ".";
  });
   
  /* jquery validation */
  $("#tableForm").validate({
    rules: rules,
    messages: messages,
    /* Place each error label directly after its input */
    errorPlacement: function(error, element) {
      error.insertAfter(element);
    },
    /* only runs when all fields are valid */
    submitHandler: function() {
      generateTable();
      return false;
    }
  });
   
  /* table generation */
  function generateTable() {
    var colMin = parseInt($("#colMin").val(), 10),
        colMax = parseInt($("#colMax").val(), 10),
        rowMin = parseInt($("#rowMin").val(), 10),
        rowMax = parseInt($("#rowMax").val(), 10);
    var numCols = colMax - colMin + 1, numRows = rowMax - rowMin + 1;
   
    /* build table */
    var html = '<table><thead><tr><th scope="col">&times;</th>';
    for (var c = colMin; c <= colMax; c++) html += '<th scope="col">' + c + '</th>';
    html += '</tr></thead><tbody>';
    for (var r = rowMin; r <= rowMax; r++) {
      html += '<tr><th scope="row">' + r + '</th>';
      for (var c = colMin; c <= colMax; c++) {
        var p = r * c;
        html += '<td' + (p === 0 ? ' class="zero-result"' : '') + '>' + p + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
   
    document.getElementById('tableScroll').innerHTML = html;
    document.getElementById('tableMeta').innerHTML =
      'Columns <strong>' + colMin + '</strong> to <strong>' + colMax + '</strong> &nbsp;|&nbsp; ' +
      'Rows <strong>' + rowMin + '</strong> to <strong>' + rowMax + '</strong> &nbsp;|&nbsp; ' +
      numCols + ' &times; ' + numRows + ' = ' + (numCols * numRows).toLocaleString() + ' cells';
   
    document.getElementById('tableSection').style.display = 'block';
    document.getElementById('tableSection').scrollIntoView({ behavior: 'smooth' });
  }
   
  /* auto generate table on page load */
  generateTable();