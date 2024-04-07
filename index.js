let table

function getParticipants() {
    const rawString = document.getElementById('participants').value
    return rawString.split(',').map(x => x.trim())
}

function renderTable() {

    // if (table) table.destroy()

    const defaultColumns = [
        {
            title: "Чекбокс",
            field: "checkbox",
            formatter: "rowSelection",
            width: 40,
            frozen: true,
            headerFilter: null,
            titleFormatter: "rowSelection",
            titleFormatterParams: { rowRange: "active" },
            vertAlign: "middle"
        },
        {
            title: 'Позиция',
            field: 'position',
            editor: 'input',
            width: 200
        },
        {
            title: 'Цена',
            field: 'price',
            editor: "input",
            width: 100,
            formatter: "money", 
            formatterParams: {
                decimal: ",",
                thousand: " ",
                symbol: "₽",
                symbolAfter: "p",
                negativeSign: true,
                precision: false,
            },
            bottomCalc:'sum',
            bottomCalcParams:{
                precision:1,
            }
        },
        {
            title: 'Челики',
            field: 'people',
            width: 200,
            editor: "list",
            editorParams: {
                values: getParticipants(),
                multiselect: true,
            }

        },
        {
            title: '',
            width: 10,
        },
    ]

    const columns = [...defaultColumns]

    const participants = getParticipants()

    participants.forEach((participantName, i) => {
        const column = {
            title: participantName,
            field: participantName,
            formatter: "money", 
            formatterParams: {
                decimal: ",",
                thousand: " ",
                symbol: "₽",
                symbolAfter: "p",
                negativeSign: true,
                precision: false,
            },
            bottomCalc:'sum',
            bottomCalcParams:{
                precision:1,
            }
        }
        columns.push(column)
    });

    table = new Tabulator('#table', {
        // persistence: true,
        maxHeight:"calc(100vh - 75px)",
        columnDefaults: {
            headerSort: false,
            headerHozAlign: "center",
            headerWordWrap: true,
            hozAlign: "center",
            maxWidth: 400,
            // width: 150,
            editorParams: {
                selectContents: false,
                search: true,
            },
        },
        columns: columns,
        data: [],
        rowContextMenu: [
           
        ]
    })

    // saveToLS(table)

    

    table.on("cellEdited", function (cell) {
        calculate(cell)
        saveToLS(table)
    });

    table.on("tableBuilt", function(){
        setFromLS(table)
    });

    

}

function calculate(cell) {
    const table = cell.getTable()
    const tableData = table.getData()

    tableData.forEach(row => {
        if (row.people && row.price && row.position) {

            const price = Number(row.price)
            const sum =  price / row.people.length

            row.people.forEach(person => {
                row[person] = sum.toFixed(1)
            })

            table.setData(tableData)
        }
    })


}

function addRow() {
    if (table) {
      table.addRow({})  
    }
}

function saveToLS(table) {

    const data = {
        rawString: document.getElementById('participants').value,
        tableData: table.getData(),
        columnDefinitions: table.getColumnDefinitions(),
    }

    localStorage.setItem('appData', JSON.stringify(data) )
}

function setFromLS(table) {
    if (localStorage.appData) {
        const data = JSON.parse(localStorage.appData)
        document.getElementById('participants').value = data.rawString
        table.setColumns(data.columnDefinitions)
        table.setData(data.tableData)
    }
}

function deleteTable() {
    localStorage.removeItem('appData')
    location.reload()
}

if(localStorage.appData){
    renderTable()
}

document.getElementById('participants').addEventListener('change', renderTable)
