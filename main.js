fetch('https://di4master.github.io/clients-table/default.json')
    .then(response => response.json())
    .then(data => (renderTable(data)))
    .catch(err => alertMessage(`Не удалось загрузить данные (${err})`));

function renderTable(data) {
    const root = document.querySelector('.table__body');

    data.sort( compare('parentId', 'id'))
        .forEach(item => createRow(item, root));

    const inactiveItems = document.querySelectorAll('[data-status="inactive"]');
    const childItems = document.querySelectorAll('.child-item');

    document.getElementById('switch').addEventListener('click', () => {
        for (let item of inactiveItems) {
            item.classList.toggle('table__row-group--hidden');
        }
        for (let item of childItems) {
            item.classList.add('child-item--hidden');
        }
    });
}

function compare(parentId, id) {
    return function(a, b) {
        if (a[parentId] > b[parentId]) return 1;
        if (a[parentId] < b[parentId]) return -1;
        if (a[id] > b[id]) return 1;
        if (a[id] < b[id]) return -1;
        return 0;
    }
}

function createRow(itemData, parentElem) {
    const {name, balance, email, isActive, parentId, id} = itemData;

    const rowGroup = document.createElement('div');
    rowGroup.className = "table__row-group";

    const row = document.createElement('div');
    row.className = "table__row";

    if (parentId) {
        parentElem = document.querySelector(`[data-id="${parentId}"]`);
        parentElem.classList.add('parent-item');
        rowGroup.classList.add("child-item");
        rowGroup.classList.add("child-item--hidden");
    }

    rowGroup.append(row);
    parentElem.append(rowGroup);

    row.append( createCell(name));
    row.append( createCell(balance));
    row.append( createCell(email));

    const status = isActive ? 'Active' : 'Inactive';
    const statusCell = createCell(status);
    row.append( statusCell);

    rowGroup.dataset.id = id;
    if (isActive === false) {
        rowGroup.dataset.status = 'inactive';
        statusCell.classList.add('inactive-color');
    } else {
        statusCell.classList.add('is_active-color');
    }

    row.addEventListener('click', () => {
        currentRow = event.currentTarget;
        while (currentRow.nextElementSibling) {
            currentRow = currentRow.nextElementSibling;
            currentRow.classList.toggle('child-item--hidden');
        };
    });
}

function createCell(item) {
    const cell = document.createElement('div');
    cell.className = "table__col";
    cell.innerHTML = item;

    return cell;
}

function alertMessage(text) {
    const alert = document.createElement('div');
    alert.className = "alert-message";
    alert.innerHTML = text;
    document.body.prepend(alert);
}