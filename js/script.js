const numericalKeys = document.querySelectorAll('.numerical-keys');
const operationKeys = document.querySelectorAll('.operation-keys');
const screenInput = document.querySelector('#screen-input');
const screenOutput = document.querySelector('#screen-output');
const toast = document.querySelector('#toast');
let calcOperation;
let noOfMissingBrackets = 0;
const showToast = (mssg) => {
    toast.textContent = mssg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 500);
}
const getValuePosition = (str, position) => {
    const n = str.substring(position).match(/^[0-9]+/);
    const p = str.substring(0, position).match(/[0-9]+$/);
    return !p && !n ? '' : (p || '') + (n || '');
}
const getCalcOperation = (newOperation) => {
    calcOperation = newOperation.split('+').join('+').split('−').join('-').split('×').join('*').split('÷').join('/').split('%').join('/100');
    let noOfOpenBrackets = calcOperation.replace(/[^(]/g, "").length;
    let noOfClosedBrackets = calcOperation.replace(/[^)]/g, "").length;
    noOfMissingBrackets = noOfOpenBrackets - noOfClosedBrackets;
    calcOperation = calcOperation + ')'.repeat(noOfMissingBrackets);
}
const addNewValue = (newOperand) => {
    if (screenInput.innerHTML.length > 200) {
        showToast("Can't enter more than 200 characters");
    } else {
        let inputSelectionStart = screenInput.selectionStart;
        let inputSelectionEnd = screenInput.selectionEnd;
        let valueReplaced = screenInput.selectionEnd - screenInput.selectionStart;
        let currentOperation = screenInput.innerHTML;
        let currentOperationArray = currentOperation.split("");
        let re = /[+÷×−]/;
        let reg = /[%)]/;
        let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
        let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
        if (re.test(prevValue) && re.test(newOperand)) {
            valueReplaced = 1;
            inputSelectionStart = inputSelectionStart - 1;
        } else if (re.test(nextValue) && re.test(newOperand)) {
            valueReplaced = 1;
        }
        if (reg.test(prevValue) && !re.test(newOperand)) {
            newOperand = '×' + newOperand;
        }
        currentOperationArray.splice(inputSelectionStart, valueReplaced, newOperand);
        let newOperation = currentOperationArray.join("");
        getCalcOperation(newOperation);
        inputSelectionStart += newOperand.length;
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
            try {
                screenInput.innerText = eval(calcOperation);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    showToast('Invalid Format');
                }
            }
            screenOutput.value = '';
        } else if (operationKey.dataset.action === 'backspace') {
            let inputSelectionStart = screenInput.selectionStart - 1;
            let inputSelectionEnd = screenInput.selectionEnd;
            let valueReplaced = inputSelectionEnd - inputSelectionStart;
            let currentOperation = screenInput.innerHTML;
            let currentOperationArray = currentOperation.split("");
            currentOperationArray.splice(inputSelectionStart, valueReplaced);
            let newOperation = currentOperationArray.join("");
            getCalcOperation(newOperation);
            inputSelectionStart;
            screenInput.innerHTML = newOperation;
            screenInput.focus();
            screenInput.selectionStart = inputSelectionStart;
        } else if (operationKey.dataset.action === 'bracket') {
            let currentOperation = screenInput.innerHTML;
            let inputSelectionStart = screenInput.selectionStart;
            let inputSelectionEnd = screenInput.selectionEnd;
            let currentOperationArray = currentOperation.split("");
            let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
            let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
            let currentIndexOperation = currentOperation.slice(0, inputSelectionStart);
            if (currentIndexOperation.includes('(')) {
                let re = /[(+÷×−]/;
                if (re.test(prevValue)) {
                    addNewValue('(');
                } else {
                    let reg = new RegExp('^[0-9)]$');
                    if (reg.test(prevValue) && reg.test(nextValue) && noOfMissingBrackets > 0) {
                        addNewValue(')×');
                    } else if (reg.test(prevValue) && noOfMissingBrackets > 0) {
                        addNewValue(')');
                    } else {
                        addNewValue('×(');
                    }
                }
            } else {
                let re = new RegExp('^[0-9]$');
                if (re.test(prevValue)) {
                    addNewValue('×(');
                } else {
                    addNewValue('(');
                }
            }
        } else {
            addNewValue(operationKey.innerText);
        }
    })
});
numericalKeys.forEach(numericalKey => {
    numericalKey.addEventListener('click', () => {
        let inputSelectionStart = screenInput.selectionStart;
        let currentOperation = screenInput.innerHTML;
        let currentOperationArray = currentOperation.split("");
        let selectValue = getValuePosition(screenInput.innerHTML, screenInput.selectionStart);
        if (numericalKey.dataset.action === 'negation') {
            let valueIndex = currentOperation.indexOf(selectValue);
            let prevValues = (selectValue === '') ? currentOperationArray.slice(inputSelectionStart - 2, inputSelectionStart).join('') : currentOperationArray.slice(valueIndex - 2, valueIndex).join('');
            if (prevValues === '(−') {
                (selectValue === '') ? currentOperationArray.splice(inputSelectionStart - 2, 2, '') : currentOperationArray.splice(valueIndex - 2, 2, '');
                inputSelectionStart -= 2;
            } else {
                (selectValue === '') ? currentOperationArray.splice(inputSelectionStart, 0, '(−') : currentOperationArray.splice(valueIndex, 0, '(−');
                inputSelectionStart += 2;
            }
            let newOperation = currentOperationArray.join("");
            screenInput.innerHTML = newOperation;
            screenInput.focus();
            screenInput.selectionStart = inputSelectionStart;
        } else if (numericalKey.dataset.action === 'decimal') {
            if (!selectValue.includes('.')) {
                addNewValue('.');
            }
            screenInput.focus();
        } else {
            addNewValue(numericalKey.innerText);
            try {
                screenOutput.value = eval(calcOperation);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    showToast('Invalid Format');
                }
            }
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