const numericalKeys = document.querySelectorAll('.numerical-keys');
const operationKeys = document.querySelectorAll('.operation-keys');
const screenInput = document.querySelector('#screen-input');
const screenOutput = document.querySelector('#screen-output');

let calcOperation;
const addNewValue = (newOperand) => {
    if (screenInput.innerHTML.length > 200) {
        console.log("can't enter more than 200 characters");
        // } else if () {
        // } else if () {
        // } else if () {
        // } else if (operators.length >= 40) {
        //     console.log("can't enter more than 40 operators");
    } else {
        let inputSelectionStart = screenInput.selectionStart;
        let inputSelectionEnd = screenInput.selectionEnd;
        let valueReplaced = screenInput.selectionEnd - screenInput.selectionStart;
        let currentOperation = screenInput.innerHTML;
        let currentOperationArray = currentOperation.split("");
        let re = /[+÷×−]/;
        let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
        let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
        if (re.test(prevValue) && re.test(newOperand)) {
            valueReplaced = 1;
            inputSelectionStart = inputSelectionStart - 1;
        } else if (re.test(nextValue) && re.test(newOperand)) {
            valueReplaced = 1;
        }
        currentOperationArray.splice(inputSelectionStart, valueReplaced, newOperand);
        let newOperation = currentOperationArray.join("");
        calcOperation = newOperation.split('+').join('+').split('−').join('-').split('×').join('*').split('÷').join('/');
        console.log(newOperation);
        console.log(calcOperation);
        inputSelectionStart++;
        screenInput.innerHTML = newOperation;
        screenInput.focus();
        screenInput.selectionStart = inputSelectionStart;
    }

}

operationKeys.forEach(operationKey => {
    operationKey.addEventListener('click', () => {
        if (operationKey.dataset.action === 'clear') {
            screenOutput.value = '';
            screenInput.innerText = '';
        } else if (operationKey.dataset.action === 'equate') {
            screenInput.innerText = eval(calcOperation);
            screenOutput.value = '';
            // } else if (operationKey.dataset.action === 'add') {
            // } else if (operationKey.dataset.action === 'subtract') {
            // } else if (operationKey.dataset.action === 'multiply') {
            // } else if (operationKey.dataset.action === 'divide') {
            } else if (operationKey.dataset.action === 'backspace') {
                console.log('backspace');
                let inputSelectionStart = screenInput.selectionStart - 1;
                let inputSelectionEnd = screenInput.selectionEnd;
                let valueReplaced = inputSelectionEnd - inputSelectionStart;
                let currentOperation = screenInput.innerHTML;
                let currentOperationArray = currentOperation.split("");
                currentOperationArray.splice(inputSelectionStart, valueReplaced);
                let newOperation = currentOperationArray.join("");
                calcOperation = newOperation.split('+').join('+').split('−').join('-').split('×').join('*').split('÷').join('/');
                console.log(newOperation);
                console.log(calcOperation);
                inputSelectionStart;
                screenInput.innerHTML = newOperation;
                screenInput.focus();
                screenInput.selectionStart = inputSelectionStart;
        } else if (operationKey.dataset.action === 'percent') {
        } else if (operationKey.dataset.action === 'bracket') {
            // screenOutput.value = operationKey.textContent;
        } else {
            addNewValue(operationKey.innerText);
        }
    })
});

const checkOperationConstraints = () => {
    if (screenInput.value.length >= 200) {
        console.log("can't enter more than 200 characters");
    } else {

    }
}

numericalKeys.forEach(numericalKey => {
    numericalKey.addEventListener('click', () => {
        if (numericalKey.dataset.action === 'negation') {
            console.log('high')
        } else if (numericalKey.dataset.action === 'decimal') {
            let inputSelectionStart = screenInput.selectionStart;
            let inputSelectionEnd = screenInput.selectionEnd;
            let valueReplaced = screenInput.selectionEnd - screenInput.selectionStart;
            let currentOperation = screenInput.innerHTML;
            let currentOperationArray = currentOperation.split("");
            let re = /[+÷×−]/;
            let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
            let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
            if (re.test(prevValue) && re.test(newOperand)) {
                valueReplaced = 1;
                inputSelectionStart = inputSelectionStart - 1;
            } else if (re.test(nextValue) && re.test(newOperand)) {
                valueReplaced = 1;
            }
            currentOperationArray.splice(inputSelectionStart, valueReplaced, '.');
            let newOperation = currentOperationArray.join("");
            inputSelectionStart++;
            screenInput.innerHTML = newOperation;
            screenInput.focus();
            screenInput.selectionStart = inputSelectionStart;
        } else {
            addNewValue(numericalKey.innerText);
            screenOutput.value = eval(calcOperation);
        }
    })
});


screenInput.addEventListener('keydown', (e) => {
    var reg = new RegExp('^[0-9]$');
    e.preventDefault();
    if (reg.test(e.key)) {
        let keyValue = e.key.toString();
        addNewValue(keyValue);
        screenOutput.value = eval(calcOperation);
    } else {
        console.log('Please use the calculator keypad');
    }
})

// screenInput.addEventListener('input', () => {
//     // console.log(screenInput.value.length);
//     // console.log(screenInput.value);
// })

