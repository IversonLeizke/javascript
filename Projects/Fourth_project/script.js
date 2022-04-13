'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
    containerMovements.innerHTML = '';
    movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__value">${mov}€</div>
    </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const userName = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(value => value[0])
            .join('');
    });
};

const calcPrintBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, value) => acc + value, 0);
    labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySumary = function (acc) {
    const incomes = acc.movements
        .filter(value => value > 0)
        .reduce((acc, value) => acc + value, 0);
    labelSumIn.textContent = `${incomes} €`;
    const outcomes = acc.movements
        .filter(value => value < 0)
        .reduce((acc, value) => acc + value, 0);
    labelSumOut.textContent = `${Math.abs(outcomes)} €`;
    const interest = acc.movements
        .filter(value => value > 0)
        .map(mov => (mov * acc.interestRate) / 100)
        .reduce((acc, value) => (value >= 1 ? acc + value : acc), 0);
    labelSumInterest.textContent = `${interest} €`;
};

userName(accounts);

let currentAccount;

const updateAccount = function (currentAccount) {
    displayMovements(currentAccount.movements);
    calcPrintBalance(currentAccount);
    calcDisplaySumary(currentAccount);
};

//Event  handler
btnLogin.addEventListener('click', function (event) {
    event.preventDefault();
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome back ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;
        updateAccount(currentAccount);
        inputLoginPin.value = inputLoginUsername.value = '';
        inputLoginPin.blur();
    }
});

btnTransfer.addEventListener(`click`, function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    if (
        amount > 0 &&
        receiverAccount &&
        receiverAccount !== currentAccount &&
        currentAccount.balance >= amount
    ) {
        currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);
        updateAccount(currentAccount);
        inputTransferTo.value = inputTransferAmount.value = '';
    }
});

btnClose.addEventListener(`click`, function (e) {
    e.preventDefault();
    if (
        currentAccount.username === inputCloseUsername.value &&
        currentAccount.pin === Number(inputClosePin.value)
    ) {
        containerApp.style.opacity = 0;
        accounts.splice(
            accounts.findIndex(
                acc => acc.username === inputCloseUsername.value
            ),
            1
        );
        inputClosePin.value = inputCloseUsername.value = '';
    }
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const loan = Number(inputLoanAmount.value);
    if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
        currentAccount.movements.push(loan);
    }
    updateAccount(currentAccount);
    inputLoanAmount.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
