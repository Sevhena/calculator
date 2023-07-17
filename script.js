const ADDSYMBOL = '\u{002B}';
const MINUSSYMBOL = '\u{2212}';
const MULTIPLYSYMBOL = '\u{00D7}';
const DIVISIONSYMBOL = '\u{00F7}';

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
        case ADDSYMBOL:
            result = add(num1, num2);
            break;
        case MINUSSYMBOL:
            result = subtract(num1, num2);
            break;
        case MULTIPLYSYMBOL:
            result = multiply(num1, num2);
            break;
        case DIVISIONSYMBOL:
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

    while (ops.includes(MULTIPLYSYMBOL) || ops.includes(DIVISIONSYMBOL)) { // higher precedence operators
        const opID = ops.indexOf(MULTIPLYSYMBOL) > -1 ? ops.indexOf(MULTIPLYSYMBOL) : ops.indexOf(DIVISIONSYMBOL);
        
        let subResult = operate(ops[opID], vals[opID], vals[opID + 1]);
        
        if (!isFinite(subResult)) {
            return "ERROR";
        }
        ops.splice(opID, 1);
        vals.splice(opID, 2, subResult);
    }

    while (ops.length > 0) {
        let subResult = operate(ops[0], vals[0], vals[0 + 1]);
        ops.splice(0, 1);
        vals.splice(0, 2, subResult);
    }

    return parseFloat(vals[0].toFixed(4));
}

function clear() {
    display.textContent = "";
    expression = "";
    lastEntryType = [];
}

function handleKeyPress(event) {
    switch(event.key) {
        case "1":
            document.querySelector('#one').click();
            break;
        case "2": 
            document.querySelector('#two').click();
            break;
        case "3": 
            document.querySelector('#three').click();
            break;
        case "4": 
            document.querySelector('#four').click();
            break;
        case "5": 
            document.querySelector('#five').click();
            break;
        case "6": 
            document.querySelector('#six').click();
            break;
        case "7": 
            document.querySelector('#seven').click();
            break;
        case "8": 
            document.querySelector('#eight').click();
            break;
        case "9": 
            document.querySelector('#nine').click();
            break;
        case "0": 
            document.querySelector('#zero').click();
            break;
        case ".": 
            document.querySelector('#point').click();
            break;
        case "/": 
            document.querySelector('#divide').click();
            break;
        case "*": 
            document.querySelector('#multiply').click();
            break;
        case "x": 
            document.querySelector('#multiply').click();
            break;
        case "+": 
            document.querySelector('#add').click();
            break;
        case "-": 
            document.querySelector('#subtract').click();
            break;
        case "Enter": 
            document.querySelector('#evaluate').click();
            break;
        case "=": 
            document.querySelector('#evaluate').click();
            break;
        case "c": 
            document.querySelector('#clear').click();
            break;
        default:
            event.preventDefault();
    }
}

function updateDisplay(event) {
    const button = event.target;
    const buttonType = button.getAttribute('data-type');
    const pointBtn = document.getElementById("point");

    if (errorFlagged) {
        messageBox.textContent = "Enter an expression.";
        messageBox.style.color = 'green';
    }

    if (button.id === "clear") {
        clear();
    }
    else if (button.id === "backspace") {
        const lastEntry = lastEntryType.pop();
        expression = expression.slice(0, this.length - (lastEntry == "operator" ? 2 : 1));
        if (lastEntry === "operator") {
            display.removeChild(display.lastChild);
        }
        else {
            display.innerHTML = display.innerHTML.slice(0, this.length - 1);
        }

        if (lastEntry === "point") {pointBtn.disabled = false;}
        else if (lastEntry === "operator" && lastEntryType[lastEntryType.length - 1] === "decimal") {
            pointBtn.disabled = true;
        }
    }
    else if (button.id === "evaluate") {
        if (lastEntryType[lastEntryType.length - 1] !== "digit" &&
            lastEntryType[lastEntryType.length - 1] !== "decimal") {
                messageBox.textContent = "Invalid expression."
                messageBox.style.color = 'red';
                errorFlagged = true;
                return;
        }
        let result = evaluate(expression);

        if (result === "ERROR") {
            messageBox.textContent = "You just tried to divide by zero. Please don't.";
                messageBox.style.color = 'red';
                errorFlagged = true;
                clear();
                return;
        }
        display.innerHTML = result;
        expression = "" + result;
    }
    else if (button.id === "point") {
        expression = expression + button.textContent;
        display.innerHTML += button.textContent;

        if (!button.disabled) {button.disabled = true;}
        lastEntryType.push("point");
    }   
    else if (buttonType === "operator") {
        expression = expression + " " + button.textContent + " ";
        
        const span = document.createElement('span');
        span.innerHTML = "&nbsp" + button.textContent + "&nbsp";
        span.style.color = 'red';
        display.appendChild(span);

        lastEntryType.push(buttonType);
        
        if (pointBtn.disabled) {pointBtn.disabled = false;}
    }
    else {

        expression = expression + button.textContent;
        display.innerHTML += button.textContent;
        
        if (lastEntryType[lastEntryType.length - 1] !== "point") {
            lastEntryType.push(buttonType);
        }
        else if (buttonType === "digit") {
            lastEntryType.push("decimal");
        }
    }
}

// let firstNum;
// let secondNum;
// let operator;

let lastEntryType = [];

let expression = "";

let errorFlagged = false;

const display = document.querySelector('#display');
const messageBox = document.querySelector('#message-box');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', updateDisplay);
})

window.addEventListener('keydown', handleKeyPress);
