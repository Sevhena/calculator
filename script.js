function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) { 
    return num1 / num2;
}

function operate(operator, num1, num2) {
    let result;

    switch(operator) {
        case '+':
            result = add(num1, num2);
            break;
        case '\u{2212}':
            result = subtract(num1, num2);
            break;
        case '\u{00D7}':
            result = multiply(num1, num2);
            break;
        case '\u{00F7}':
            result = divide(num1, num2);
            break;
    }

    return result;
}

function parseExpression(expression) {
    const ops = [];
    const vals = [];

    let newExpression = expression.split(" ");

    newExpression.forEach((item) => {
        if (isNaN(+item)) {ops.push(item);}
        else {vals.push(+item);}
    })
    console.table(ops);
    console.table(vals);

    return [ops, vals];
}

function evaluate(expression) {
    const parsedExpression = parseExpression(expression);
    let ops = parsedExpression[0];
    const vals = parsedExpression[1];

    while (ops.includes("\u{00D7}") || ops.includes("\u{00F7}")) { // higher precedence operators
        const opID = ops.indexOf('\u{00D7}') > -1 ? ops.indexOf('\u{00D7}') : ops.indexOf('\u{00F7}');
        
        let subResult = operate(ops[opID], vals[opID], vals[opID + 1]);
        ops.splice(opID, 1);
        vals.splice(opID, 2, subResult);
    }

    while (ops.length > 0) {
        let subResult = operate(ops[0], vals[0], vals[0 + 1]);
        ops.splice(0, 1);
        vals.splice(0, 2, subResult);
    }

    return vals[0];
}

function clear() {
    display.textContent = "";
    expression = "";
}

function updateDisplay(event) {
    if (event.target.id === "clear") {
        clear();
    }
    else if (event.target.id === "evaluate") {
        let result = evaluate(expression);
        display.textContent = result;
        expression = "" + result;
    }
    else {
        let buttonValue;
        if (event.target.classList.contains("operator")) {
            buttonValue = " " + event.target.textContent + " ";
        }
        else {
            buttonValue = event.target.textContent;
        }
        // console.log(event.target);
        expression = expression + buttonValue;
        display.textContent = expression;
        
    }
}

let firstNum;
let secondNum;
let operator;

let expression = "";

const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {

    button.addEventListener('click', (event) => updateDisplay(event));
})
