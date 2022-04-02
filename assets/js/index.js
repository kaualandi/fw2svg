const $inputForm = document.querySelector('#input-form');
const $input = document.querySelector('#input');
const $output = document.querySelector('#output');
const $preview = document.querySelector('#preview');

$inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $input.value;

    $preview.innerHTML = "";
    $preview.innerHTML = input;
    $output.innerHTML = "";

    const checkSVG = setInterval(() => {
        if ($preview.innerHTML.includes('<svg')) {
            const regex = /<!--(.*)-->/g;
            $output.innerHTML = $preview.innerHTML.replace(regex, '');
            clearInterval(checkSVG);
        }
    }, 100);
});