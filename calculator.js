// треугольники регулировщики
const triangles = document.querySelectorAll('.triangle-btn');

const min = 10;
const max = 5000;
let interval;

const increaseDegrease = e => {
    const currentProperty = e.target.dataset.property;
    const closestInput = e.target.closest('.input-place').querySelector('.form-field');
    let closestInputValue = +closestInput.value;

    currentProperty === 'up' ? closestInputValue++ : closestInputValue--;

    if (closestInputValue > max) {
        closestInputValue = max;
    } else if (closestInputValue < min) {
        closestInputValue = min;
    }

    closestInput.value = closestInputValue;
}
triangles.forEach(triangle => {
    triangle.addEventListener('click', e => increaseDegrease(e));
    triangle.addEventListener('touchstart', e => interval = setInterval(() => increaseDegrease(e), 100));
    triangle.addEventListener('touchend', () => clearInterval(interval));
});

// ограничение числовых полей
const numberField = document.querySelector('.new-calculator-form input.form-field');
numberField.addEventListener('input', e => {
    if (e.target.value >= 10 && e.target.value <= 5000) {
        e.target.value = +e.target.value;
    } else if (e.target.value < min) {
        e.target.value = min;
    } else if (e.target.value > max) {
        e.target.value = max;
    }
});

// события прокрутки
const rates = document.querySelector('.rates-outer-block').offsetTop * -1;
document.addEventListener('scroll', e => {
    const scrollWindow = e.target.body.getBoundingClientRect().top;
    const tableHeader = document.querySelector('.rates-wrapper');

    scrollWindow <= rates
        ? tableHeader.classList.add('fixed-header-bg-color')
        : tableHeader.classList.remove('fixed-header-bg-color');
});

// показать все функции
document.getElementById('show-functionality-btn').addEventListener('click', btn => {
    let currentBtnText = btn.target.innerText.toLowerCase();
    const functionsWindow = document.querySelector('.functions-window');
    const mistBlock = document.querySelector('.actions-place')
    const functionsWindowStyle = functionsWindow.style;
    const fullTableHeight = document.querySelector('.functions-window__table-place').getBoundingClientRect().height + 40;
    functionsWindowStyle.height = `${fullTableHeight}px`;

    if (currentBtnText === 'показать функционал') {
        mistBlock.classList.remove('mist');
        currentBtnText = 'скрыть функционал';
    } else {
        document.querySelector('html').scroll({top: rates * -1 - 200, behavior: 'smooth'});
        functionsWindowStyle.height = '370px';
        mistBlock.classList.add('mist');
        currentBtnText = 'показать функционал';
    }

    btn.target.innerText = currentBtnText;
});

// логика расчета
const middle = 1700;
const priceList = {
    5:  9807.04,
    10:  17548.24,
    20:  28011.08,
    50:  52371.12,
    100:  79863.64
};

const calculateForm = document.getElementById('new-calculator-form');
const discountData = document.querySelectorAll('.discount-field');

document.getElementById('calculate-btn').addEventListener('click', e => {
    e.preventDefault();
    const discountPercent = +discountData[0].value;
    const discountTime = discountData[1].value;

    const calculateData = [...new FormData(calculateForm)]; // аналогично как Array.from(new FormData(calculateForm))

    const leftMonth = calculateData[2][1] * middle / 12;
    const rightMonth = priceList[calculateData[3][1]];

    const fullMonthSumm = leftMonth + rightMonth; // полная стоимость СТАРТ без скидки
    const increasePercent = fullMonthSumm * 30 / 100 // 30% от полной стоимости СТАРТ
    const fullMonthSummExtended = fullMonthSumm + increasePercent; /// полная стоимость РАСШИРЕННЫЙ без скидки

    const fastStartFormatted = Math.round(fullMonthSumm).toLocaleString();
    const extendedFormatted = Math.round(fullMonthSummExtended).toLocaleString();

    const ratesPrices = document.querySelectorAll('.prices .price');
    const discount = document.querySelectorAll('.price-after-discount');

    if (discount.length) {
        discount.forEach(item => item.remove());
        ratesPrices.forEach(item => item.classList.remove('discount-old-price'));
    }

    if (discountPercent > 0) {
        const prices = document.querySelectorAll('.prices');
        const fullMonthResult = fullMonthSumm - (fullMonthSumm * discountPercent / 100); // полная стоимость СТАРТ со скидкой (если есть)
        const fullMonthResultExtended = fullMonthSummExtended - (fullMonthSummExtended * discountPercent / 100); // полная стоимость РАСШИРЕННЫЙ со скидкой (если есть)

        const fastStartDiscountFormatted = Math.round(fullMonthResult).toLocaleString();
        const extendedDiscountFormatted = Math.round(fullMonthResultExtended).toLocaleString();

        const resultsArray = [fastStartDiscountFormatted, extendedDiscountFormatted].map(item => `<div class="price-after-discount">
                    <span class="discount-new-price">${item} руб</span>
                    <div class="discount-deadline">Срок действия акции до ${discountTime}</div>
             </div>`);

        ratesPrices.forEach(item => item.classList.add('discount-old-price'));
        prices.forEach((item, index) => item.insertAdjacentHTML('afterbegin', resultsArray[index]));
    }

    document.querySelectorAll('.fast-start').forEach(item => item.innerHTML = `${fastStartFormatted} руб`);
    document.querySelectorAll('.extended').forEach(item => item.innerHTML = `${extendedFormatted} руб`);
});
