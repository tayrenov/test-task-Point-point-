'use stritch';

document.addEventListener('DOMContentLoaded', () => {   

    const carring = document.querySelector('#carrying');


    function checkListStyle(obj) {
        const value = obj.value;

        if (obj.value=='0') {
            obj.classList.add("value-0");
        } else {
            obj.classList.remove("value-0");
        }
    }

    carring.addEventListener('input', function(e) {
        checkListStyle(carring);
    });

    checkListStyle(carring);
});

    
