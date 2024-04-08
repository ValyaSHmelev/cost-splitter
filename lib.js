function deleteRows() {
    const selectedRows = table.getSelectedRows()
    if (selectedRows.length > 0) {
        if (confirm('Вы действительно хотите удалить выделенные строки?')) {
            selectedRows.forEach(row => row.delete());
        }
    } else {
        alert('Необходимо выбрать хотя бы 1 строку.')
    }
}

function exportAppData() {
    if (localStorage.appData) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.appData);
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = 'разделяйка.json';
        a.click();
    } else {
        alert('Данные отсутствуют')
    }
}

async function importAppData() {
    const [fileHandle] = await window.showOpenFilePicker({
        types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
        }]
    });
    const file = await fileHandle.getFile();
    const text = await file.text();
    localStorage.appData = text
    location.reload()
}

