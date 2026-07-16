// Chart

const breakdownChart = document.getElementById('breakdownChart');


const bar = new Chart(breakdownChart, {
    type: 'bar',
    data: {
        labels: ['Food', 'Transportation', 'Hobbies', 'Bills'],
        datasets: [{
            label: 'Expense Breakdown',
            data: [4000, 2000, 1000, 12000],
            backgroundColor: '#523E67',
            hoverBorderWidth: 4,
            hoverBorderColor: '#000',
        }],
    },
    options: {},
})


// define local storage and add existing data
// data format: (name, amount, type, category, date, action (btnEdit, btnDelete))

let transactions = [
    {
        name: 'Test1',
        amount: 300,
        type: 'Expense',
        category: 'Food',
        date: 'July 12, 2026',
    }
];

const saveData = () => {
    const transactionStringified = JSON.stringify(transactions);

    localStorage.setItem('transactions', transactionStringified);
}

const loadData = () => {
    transactions = JSON.parse(localStorage.getItem('transactions'));
}

const renderTable = () => {
    const tbody = document.querySelector('tbody');

    transactions.forEach(transaction => {

        const newTr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = transaction.name;

        const tdAmount = document.createElement('td');
        tdAmount.textContent = transaction.amount;

        const tdType = document.createElement('td');
        tdType.textContent = transaction.type;

        const tdCategory = document.createElement('td');
        tdCategory.textContent = transaction.category;

        const tdDate = document.createElement('td');
        tdDate.textContent = transaction.date;

        const tdAction = document.createElement('td');

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('table-btn-group');

        const newEditBtn = document.createElement('button');
        newEditBtn.classList.add('btnEdit');
        newEditBtn.textContent = 'Edit'

        const newDeleteBtn = document.createElement('button');
        newDeleteBtn.classList.add('btnDelete');
        newDeleteBtn.textContent = 'Delete'

        actionDiv.append(newEditBtn);
        actionDiv.append(newDeleteBtn);

        tdAction.append(actionDiv);

        newTr.append(tdName);
        newTr.append(tdAmount);
        newTr.append(tdType);
        newTr.append(tdCategory);
        newTr.append(tdDate);
        newTr.append(tdAction);

        tbody.append(newTr);
    });
}




loadData();
renderTable();