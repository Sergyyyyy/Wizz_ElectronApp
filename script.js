// to reset local storage, add this command to main.js
// win.webContents.openDevTools();

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


// element references

const btnAddTransaction = document.getElementById('btnAddTransaction');
const btnManageCategories = document.getElementById('btnManageCategories');
const btnEdit = document.querySelector('.btnEdit');
const btnDelete = document.querySelector('.btnDelete');

const balanceText = document.getElementById('balance-text');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense-text');

let transactions = [
    {
        name: 'Sample Transaction',
        amount: 1000,
        type: 'Income',
        category: 'Allowance',
        date: '18-7-2026',
    }
];

let categories = [
    'Food',
    'Transportation',
    'Bills'
]

const updateChart = () => {
    const totals = {};

    transactions.forEach(transaction => {
        // Ignore income
        if (transaction.type !== "Expense") return;

        if (!totals[transaction.category]) {
            totals[transaction.category] = 0;
        }

        totals[transaction.category] += Number(transaction.amount);
    });

    console.log(totals);

    bar.data.labels = Object.keys(totals);

    bar.data.datasets[0].data = Object.values(totals);

    bar.update();
}

const updateSummaryCards = () => {
    let totalExpense = 0, totalIncome = 0;

    transactions.forEach(transaction => {
        if (transaction.type == 'Expense'){
            totalExpense += Number(transaction.amount);
        }
        else if (transaction.type == 'Income'){
            totalIncome += Number(transaction.amount);
        }
    })

    let currentBalance = totalIncome - totalExpense;
    
    balanceText.textContent = '₱' + currentBalance;
    incomeText.textContent = '₱' + totalIncome;
    expenseText.textContent = '₱' + totalExpense;
}

const saveData = () => {
    const transactionStringified = JSON.stringify(transactions);
    const categoryStringified = JSON.stringify(categories);

    localStorage.setItem('transactions', transactionStringified);
    localStorage.setItem('categories', categoryStringified);
}

const loadData = () => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedCategories = localStorage.getItem('categories');

    if (storedTransactions == null) { saveData() }
    else { transactions = JSON.parse(storedTransactions) }

    if (storedCategories == null) { saveData() }
    else { categories = JSON.parse(storedCategories) }
}


const getCurrentDate = () => {
    let today, thisMonth, thisYear;
    today = thisMonth = thisYear = new Date();

    const dayOfMonth = today.getDate();
    const currentMonth = thisMonth.getMonth();
    const currentYear = thisYear.getFullYear();

    const currentDate = dayOfMonth + '/' + (currentMonth + 1) + '/' + currentYear;

    return currentDate;
}

const toISODate = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const renderTable = () => {
    const tbody = document.querySelector('tbody');

    const allTr = document.querySelectorAll('tbody tr');

    allTr.forEach(tr => {
        tr.remove();
    })

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
        newEditBtn.addEventListener('click', () => { editData(transaction) });

        const newDeleteBtn = document.createElement('button');
        newDeleteBtn.classList.add('btnDelete');
        newDeleteBtn.textContent = 'Delete'
        newDeleteBtn.addEventListener('click', () => { deleteData(transaction) });

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

const addTransaction = async () => {
    let typePlaceholder;
    let categoryPlaceholder;

    const transactionName = await swal.fire({
        inputLabel: 'Enter Transaction Name:',
        input: 'text',
        showCancelButton: true
    })

    if (!transactionName.isConfirmed) { return; }

    const transactionAmount = await swal.fire({
        inputLabel: 'Enter Transaction Amount:',
        input: 'number',
        showCancelButton: true
    })

    if (!transactionAmount.isConfirmed) { return; }

    const transactionType = await swal.fire({
        inputLabel: 'Choose Transaction Type',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Income',
        denyButtonText: 'Expense',
    })

    if (transactionType.isConfirmed) {
        typePlaceholder = 'Income';
    }
    else if (transactionType.isDenied) {
        typePlaceholder = 'Expense';
    }
    else {
        return;
    }

    const transactionCategory = await swal.fire({
        inputLabel: 'Choose Tranaction Category',
        showCancelButton: true,
        inputOptions: Object.fromEntries(
            categories.map((category, index) => [index, category])
        ),
        input: 'select'
    })

    if (!transactionCategory.isConfirmed) { return; }

    categoryPlaceholder = categories[transactionCategory.value]


    const transaction = {
        name: transactionName.value,
        amount: transactionAmount.value,
        type: typePlaceholder,
        category: categoryPlaceholder,
        date: getCurrentDate()
    }

    transactions.push(transaction);
    saveData();
    loadData();

    swal.fire({
        title: 'New Transaction has been added!',
        icon: 'success',
        showCancelButton: true
    })

    renderTable();
    updateChart();
    updateSummaryCards();
}

const editData = async (e) => {
    const result = await Swal.fire({
        title: 'Edit Transaction',
        html: `
        <input id="swal-name" class="swal2-input" placeholder="e.name" value="${e.name}"    >
        <input id="swal-amount" class="swal2-input" type="number" placeholder="e.amount" value="${e.amount}">

        <select id="swal-type" class="swal2-select">
        <option ${e.type === "Income" ? "selected" : ""}>Income</option>
        <option ${e.type === "Expense" ? "selected" : ""}>Expense</option>
        </select>

        <select id="swal-category" class="swal2-select">
            <option ${e.category === 'Food' ? "selected" : ""}>Food</option>
            <option ${e.category === 'Bills' ? "selected" : ""}>Bills</option>
            <option ${e.category === 'Transportation' ? "selected" : ""}>Transportation</option>
        </select>

        <input id="swal-date" class="swal2-input" type="date" value="${toISODate(e.date)}">
    `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                name: document.getElementById('swal-name').value,
                amount: document.getElementById('swal-amount').value,
                type: document.getElementById('swal-type').value,
                category: document.getElementById('swal-category').value,
                date: document.getElementById('swal-date').value
            };
        }
    });

    if (!result.isConfirmed) return;

    const transact = result.value;

    e.name = transact.name;
    e.amount = transact.amount;
    e.type = transact.type;
    e.category = transact.category;
    e.date = transact.date;

    saveData();

    swal.fire({
        inputLabel: 'Successfuly Edited Transaction.',
        icon: 'success',
        showCancelButton: true,
    })

    renderTable();
    updateChart();
    updateSummaryCards();
}

const deleteData = async (transaction) => {
    const confirmation = await Swal.fire({
        title: 'Are you sure you want to delete this transaction?',
        icon: 'warning',
        showCancelButton: true
    });

    if (!confirmation.isConfirmed) return;

    const index = transactions.indexOf(transaction);

    if (index !== -1) {
        transactions.splice(index, 1);
    }

    saveData();
    renderTable();
    updateChart();
    updateSummaryCards();
}

const createCategory = async () => {
    const newCategory = await swal.fire({
        inputLabel: 'Enter a new category.',
        icon: 'info',
        input: 'text'
    });

    if (!newCategory.isConfirmed){ return; }

    const category = {
        category: newCategory.value
    }

    categories.push(formatText(category.category));
}

const formatText = (text) => {
    const splitText = text.split("");

    splitText[0] = splitText[0].toUpperCase()

    const joinedText = splitText.join("");

    text = joinedText;

    return text;
}

btnAddTransaction.addEventListener('click', addTransaction);
btnManageCategories.addEventListener('click', createCategory);

loadData();
renderTable();
updateChart();
updateSummaryCards();