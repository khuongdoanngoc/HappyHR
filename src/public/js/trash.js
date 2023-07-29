document.addEventListener('DOMContentLoaded', function () {

    var employeeID
    var btnDeleteEmployee = document.getElementById('force-delete-btn')
    var deleteForm = document.forms['delete-employee-form']
    var restoreForm = document.forms['restore-employee-form']
    var btnRestore = $('.update-btn')
    var employeeCheckedAll = $('#checkbox-all')
    var employeeCheckedItems = $('input[name="employeeIds[]"]')
    var btnSubmitAllChecked = $('.btn-submit-all-checked')



    $('#delete-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        employeeID = button.data('id')
    })


    btnDeleteEmployee.onclick = function (e) {
        deleteForm.action = '/manage/' + employeeID + '/forceDelete?_method=DELETE'
        deleteForm.submit()
    }

    btnRestore.click(function (e) {
        e.preventDefault()
        const employeeID = $(this).data('id')
        restoreForm.action = '/manage/' + employeeID + '/restore?_method=PATCH'
        restoreForm.submit()
    })

    employeeCheckedAll.change(function () {
        var isCheckedAll = $(this).prop('checked')
        employeeCheckedItems.prop('checked', isCheckedAll)
        renderBtnSubmitAllCheked()
    })

    employeeCheckedItems.change(function () {
        var isCheckboxActiveAll = $('input[name="employeeIds[]"]:checked').length === employeeCheckedItems.length
        employeeCheckedAll.prop('checked', isCheckboxActiveAll)
        renderBtnSubmitAllCheked()
    })

    // re-render submit button all checked
    function renderBtnSubmitAllCheked() {
        if (($('input[name="employeeIds[]"]:checked').length) > 0) {
            btnSubmitAllChecked.removeClass('disabled')
        } else {
            btnSubmitAllChecked.addClass('disabled')
        }
    }

    btnSubmitAllChecked.on('submit', function (e) {
        const isSubmitable = !$(this).hasClass('disabled')
        if (!isSubmitable) {
            e.preventDefault()
        }
    })
})