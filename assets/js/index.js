const $inputForm = document.querySelector('#input-form');
const $input = document.querySelector('#input');
const $output = document.querySelector('#output');
const $preview = document.querySelector('#preview');
const $iconState = document.querySelector('#icon-state');
$iconState.style.display = 'none';

$inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $preview.innerHTML = "";
    $preview.innerHTML = $input.value;
    $output.innerHTML = "";
    $iconState.removeEventListener('click', copyToClipboard);
    $iconState.style.display = 'none';
    $iconState.classList.remove('zoom-in');
    $iconState.classList.remove('zoom-out');
    const checkSVG = setInterval(() => {
        if ($preview.innerHTML.includes('<svg')) {
            const regex = /<!--(.*)-->/g;
            const text = $preview.innerHTML.replace(regex, '');
            $output.innerHTML = text;
            $iconState.style.display = 'inline-block';
            $iconState.addEventListener('click', () => copyToClipboard(text));
            clearInterval(checkSVG);
        }
    }, 100);
    $input.value = '';
    $input.focus();
});

function copyToClipboard(text) {
    $iconState.classList.remove('zoom-in');
    $iconState.classList.remove('zoom-out');
    $iconState.innerHTML = '<i class="fa-solid fa-spinner-third fa-spin"></i>';
    navigator.clipboard.writeText(text).then(function () {
        $iconState.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }, function (err) {
        $iconState.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }).finally(() => {
        $iconState.classList.add('zoom-in');
        setTimeout(() => {
            $iconState.classList.remove('zoom-in');
            setTimeout(() => {
                $iconState.classList.add('zoom-out');
                $iconState.innerHTML = '<i class="fa-solid fa-copy"></i>';
            }, 2000);
        }, 1000);
    });
}