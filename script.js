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


