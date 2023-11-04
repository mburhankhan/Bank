//Import Section
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from 'chalk';
//Customer Class
class Customer {
    constructor(fname, lname, gender, age, mobileNo, accNo) {
        this.fname = fname,
            this.lname = lname,
            this.gender = gender,
            this.age = age,
            this.mobileNo = mobileNo;
        this.accNo = accNo;
    }
}
//Bank Class
class Bank {
    constructor() {
        this.Customer = [];
        this.BankAccount = [];
    }
    //Customer Data Push Function
    addCustomer(object) {
        this.Customer.push(object);
    }
    //Customer Bank Accounts Push Function
    addAccount(object) {
        this.BankAccount.push(object);
    }
    //Customer New Balance Push Fuction
    addTransaction(object) {
        let newAccount = this.BankAccount.filter(val => val.accNo !== object.accNo);
        this.BankAccount = [...newAccount, object];
    }
}
//Create Customer
let customers = new Bank();
for (let i = 1; i <= 5; i++) {
    let fname = faker.person.firstName("male");
    let lname = faker.person.lastName("male");
    let gender = "Male";
    let age = faker.number.int({ min: 18, max: 60 });
    let mobileNo = parseInt(`+923${Math.random() * 10000000000}`);
    let accNo = 2000 + i;
    let pin = 5000 + i;
    let balance = 1000 * i;
    const cus = new Customer(fname, lname, gender, age, mobileNo, accNo);
    const acc = {
        accNo: accNo,
        pin: pin,
        balance: balance
    };
    customers.addCustomer(cus);
    customers.addAccount(acc);
}
//Bank Functions
let bankFunction = async (customers) => {
    while (true) {
        //First Response from User
        let res = await inquirer.prompt([
            {
                type: "number",
                name: "accNo",
                message: "Enter your Account Number:"
            },
            {
                type: "number",
                name: "pin",
                message: "Enter your pin code"
            }
        ]);
        //Identify User from Database
        let account = customers.BankAccount.find(val => val.accNo === res.accNo && val.pin === res.pin);
        if (!account) {
            console.log(`${chalk.red.bold("Invalid Account and Pin")}`);
        }
        if (account) {
            let user = customers.Customer.find(val => val.accNo === res.accNo);
            console.log(`${chalk.yellow.italic("Welcome Mr.", user?.fname, user?.lname)}`);
            //Second Response from User
            let services = await inquirer.prompt({
                type: "list",
                name: "Service",
                message: "Select an option:",
                choices: ["Deposit", "Withdraw", "Balance Inquiry"]
            });
            //Deposit Response from User
            if (services.Service === "Deposit") {
                let deposit = await inquirer.prompt({
                    type: "number",
                    name: "deposit",
                    message: "Enter Amount:"
                });
                if (deposit.deposit) {
                    //User New Balance after Deposit
                    let addDeposit = account.balance + deposit.deposit;
                    //Push New Balance after Deposit
                    customers.addTransaction({ accNo: account.accNo, pin: account.pin, balance: addDeposit });
                    console.log(`${chalk.blue.bold("Desposit Amount:")} ${chalk.blue.bold(deposit.deposit)}`);
                    console.log(`${chalk.green.bold("Current Balance:")} ${chalk.green.bold(addDeposit)}`);
                }
            }
            //Withdrawl Response from User
            if (services.Service === "Withdraw") {
                let withdraw = await inquirer.prompt({
                    type: "number",
                    name: "Withdraw",
                    message: "Enter Amount:"
                });
                if (withdraw.Withdraw <= account.balance) {
                    //User New Balance after Withdrawl
                    let lessWithdraw = account.balance - withdraw.Withdraw;
                    //Push New Balance after Withdrawl
                    customers.addTransaction({ accNo: account.accNo, pin: account.pin, balance: lessWithdraw });
                    console.log(`${chalk.blue.bold("Withdrawal Amount:")} ${chalk.blue.bold(withdraw.Withdraw)}`);
                    console.log(`${chalk.green.bold("Current Balance:")} ${chalk.green.bold(lessWithdraw)}`);
                }
                else {
                    console.log(`${chalk.red.bold("Transaction Error!")} Please enter valid amount`);
                }
            }
            //Balance Response from User
            if (services.Service === "Balance Inquiry") {
                console.log(`${chalk.green.bold("Current Balance:", account.balance)} `);
            }
        }
    }
};
bankFunction(customers);
// 55MIN
