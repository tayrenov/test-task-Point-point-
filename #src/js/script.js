'use stritch';

document.addEventListener('DOMContentLoaded', () => {   
/*получаем объекты для обработки элементов при загрузке страницы*/
    const carrying = document.querySelector('#carrying'),
          cargoType= document.querySelector('#cargoType');
 
/*Проверка введённого значения и изменение стиля*/          
    function checkListStyle(obj) {

        const object = document.querySelector(obj);
        const value = object.value;

        if (object.value=='0') {
            object.classList.add("value-0");
        } else {
            object.classList.remove("value-0");
        }
    }
/**Клик на "Грузоподъёмность*/
    carrying.addEventListener('input', function(e) {
        checkListStyle('#carrying');
    });
/**Клик на "Тип груза*/
    cargoType.addEventListener('input', function(e) {
        checkListStyle('#cargoType');
    });
    
/**Гасим элементы при загрузке страницы*/
    checkListStyle('#carrying');
    checkListStyle('#cargoType');
});

    
