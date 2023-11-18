var isFormOpen = false;

function openForm() {
    document.getElementById("popup").style.display = "block";
    history.replaceState({ state: 'formClosed' }, 'Форма обратной связи', '?formClosed');
    history.pushState({ state: 'formOpen' }, 'Форма обратной связи', '?formOpen');
    isFormOpen = true;
    restoreFormData(); 
}

function closeForm() {
    document.getElementById("popup").style.display = "none";
    history.pushState({ state: 'formClosed' }, 'Закрыта форма обратной связи', '?formClosed');
    isFormOpen = false;
}

function submitForm() {
    var formData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        organization: document.getElementById("organization").value,
        message: document.getElementById("message").value,
        consent: document.getElementById("consent").checked
    };

    saveFormDataToLocalStorage(formData);

    sendFormData(formData);
}

function sendFormData(formData) {
    $.ajax({
        url: 'https://formcarry.com/s/INtyAovkIT',
        method: 'POST',
        dataType: 'json',
        data: formData,
        success: function (response) {
            document.getElementById("response").innerHTML = "Данные успешно отправлены!";
            clearForm();
        },
        error: function (error) {
            document.getElementById("response").innerHTML = "Ошибка при отправке данных.";
        }
    });
}

function saveFormDataToLocalStorage(formData) {
    localStorage.setItem('formData', JSON.stringify(formData));
}

function restoreFormData() {
    var storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
        var formData = JSON.parse(storedFormData);
        document.getElementById("fullName").value = formData.fullName;
        document.getElementById("email").value = formData.email;
        document.getElementById("phone").value = formData.phone;
        document.getElementById("organization").value = formData.organization;
        document.getElementById("message").value = formData.message;
        document.getElementById("consent").checked = formData.consent;
    }
}

function clearForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("organization").value = "";
    document.getElementById("message").value = "";
    document.getElementById("consent").checked = false;
}

window.onpopstate = function (event) {
 
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('utm') === 'closedFrom') {
        closeForm();
    } else {
        if (event.state && event.state.state === 'formOpen' && isFormOpen) {
            openForm();
        } else if (event.state && event.state.state === 'formClosed' && !isFormOpen) {
            closeForm();
        }
    }
};
