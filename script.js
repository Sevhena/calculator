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
    lastEntryType = [];
}

function updateDisplay(event) {
    const button = event.target;
    const buttonType = button.getAttribute('data-type');
    const pointBtn = document.getElementById("point");

    if (button.id === "clear") {
        clear();
    }
    else if (button.id === "backspace") {
        const lastEntry = lastEntryType.pop();
        expression = expression.slice(0, this.length - (lastEntry == "operator" ? 2 : 1));
        display.textContent = expression;

        if (lastEntry === "point") {pointBtn.disabled = false;}
        else if (lastEntry === "operator" && lastEntryType[lastEntryType.length - 1] === "decimal") {
            pointBtn.disabled = true;
        }
    }
    else if (button.id === "evaluate") {
        let result = evaluate(expression);
        display.textContent = result;
        expression = "" + result;
    }
    else if (button.id === "point") {
        expression = expression + button.textContent;
        display.textContent = expression;

        if (!button.disabled) {button.disabled = true;}
        lastEntryType.push("point");
    }   
    else {
        let buttonValue;
        if (buttonType === "operator") {
            buttonValue = " " + button.textContent + " ";
        
            if (pointBtn.disabled) {pointBtn.disabled = false;}
        }
        else {
            buttonValue = button.textContent;
        }
        // console.log(event.target);
        // console.table(lastEntryType);
        expression = expression + buttonValue;
        display.textContent = expression;
        if (lastEntryType[lastEntryType.length - 1] !== "point") {
            lastEntryType.push(buttonType);
        }
        else if (buttonType === "digit") {
            lastEntryType.push("decimal");
        }
    }
    console.table(lastEntryType);
}

// let firstNum;
// let secondNum;
// let operator;

let lastEntryType = [];

let expression = "";

const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {

    button.addEventListener('click', (event) => updateDisplay(event));
})
