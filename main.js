fetch('https://di4master.github.io/clients-table/default.json')
    .then(response => response.json())
    .then(data => (renderTable(data)))
    .catch(err => alertMessage(`Не удалось загрузить данные (${err})`));

function renderTable(data) {
    const root = document.querySelector('.table__body');

    const dataArray = [];
    const rowsContainer = document.createElement('div');
    rowsContainer.className = 'table__rows-container';

    data.sort( compare('parentId', 'id'))
        .forEach(item => createRow(item, rowsContainer, dataArray));

    root.append(rowsContainer);   // Добавляем таблицу в DOM одним рендером

    const inactiveItems = document.querySelectorAll('[data-status="inactive"]');
    const childItems = document.querySelectorAll('.child-item');
    const parentItems = document.querySelectorAll('.parent-item');

    document.getElementById('switch').addEventListener('click', () => {
        for (let item of inactiveItems) {
            item.classList.toggle('table__row-group--hidden');
        }

        for (let item of childItems) {
            item.classList.add('child-item--hidden');
        }

        for (let item of parentItems) {
            item.classList.remove('parent-item--opened');
            if (event.target.checked) {   // Отрисовка стрелки для элемента родителя
                checkActiveChild(item.children) ?
                    item.classList.add('parent-item') :
                    item.classList.remove('parent-item');
            } else {
                item.classList.add('parent-item');
            }
        }
    });

    rowsContainer.addEventListener('click', () => {
        let closestRow = event.target.closest('.table__row');

        if (closestRow) {
            toggleChildrenRows(closestRow);

        } else {   // Клик на псевдо элемент
            let arrowTarget = event.target.classList.contains('table__row-group');
            if (arrowTarget) {
                childRow = (event.target.querySelector('.table__row'));
                toggleChildrenRows(childRow);
            }
        }
    });
}

function checkActiveChild(children) {
    for (let i = 1; i < children.length; i++) {
        if (children[i].dataset.status === 'active') return true;
    }
    return false;
}

function toggleChildrenRows(currentRow) {
    currentRow.parentNode.classList.toggle('parent-item--opened');

    while (currentRow.nextElementSibling) {
        currentRow = currentRow.nextElementSibling;
        currentRow.classList.toggle('child-item--hidden');

        // Возвращаем дочерние элементы в исходное состояние
        if (currentRow.classList.contains('child-item--hidden')) {
            currentRow.classList.remove('parent-item--opened');

            const childrenRows = currentRow.querySelectorAll('.child-item');
            for (let item of childrenRows) {
                item.classList.add('child-item--hidden');
                item.classList.remove('parent-item--opened');
            };
        }
    }
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

function createRow(itemData, parentElem, dataArray) {
    const {name, balance, email, isActive, parentId, id} = itemData;

    const rowGroup = document.createElement('div');
    rowGroup.className = "table__row-group";

    dataArray[id] = rowGroup;   // Кэшируем текущий элемент

    const row = document.createElement('div');
    row.className = "table__row";

    if (parentId) {
        parentElem = dataArray[parentId];
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
    rowGroup.dataset.status = status.toLowerCase();
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