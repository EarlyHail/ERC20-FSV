$(document).ready(function(){
    $('#btn-file-upload').on('click', function() {
        const fileName1 = $('#file1').val().split(".")[1].toLowerCase();
        const fileName2 = $('#file2').val().split(".")[1].toLowerCase();
        const fileName3 = $('#file3').val().split(".")[1].toLowerCase();
        let extension = "sol"
        if (fileName1 != extension || fileName2 != extension) {
            alert("File Extension must be .sol");
            return;
        }
        extension = "js"
        if(fileName3 != extension){
            alert("File Extension must be .js");
            return;
        }
        const form = $('#file-upload-form')[0];
        const formData = new FormData(form);

        $('#btn-file-upload').text('Verifying...');
        $('#btn-file-upload').addClass('verifying-button');
        $.ajax({
            type: 'POST',
            url: '/',
            data: formData,
            processData: false,
            contentType: false,
            success : function(data){
                $('#output').html(data);
                $('#btn-file-upload').text('Verify');
                $('#btn-file-upload').removeClass('verifying-button');
            },
            error : function(){
                alert("Communication Failure");
                $('#btn-file-upload').text('Verify');
                $('#btn-file-upload').removeClass('verifying-button');
            }
        });
    });
    const files = ['#file1', '#file2', '#file3'];
    $.each(files, function(index, fileClass) {
        $(fileClass).on('change', function () {
            const cur = $(fileClass).val();
            $(".upload-name"+fileClass.charAt(fileClass.length-1)).val(cur);
        });
    });
});
const getLists = async () => {
    return fetch("/examples", {
        method: "GET",
    })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((exampleList) => {
            console.log(exampleList);
            return exampleList;
        })
        .catch((err) => {
            alert("try again!!!");
        });
}
const getExampleHTML = (text) => {
    return `<section class="example-card">${text}</section>`;
}
const renderExamples = (examples) => {
    const exampleContent = document.querySelector(".example-content");
    for(let i=0; i<10; i++){
        examples.forEach(example => {
            exampleContent.insertAdjacentHTML("beforeend", getExampleHTML(example));
        })
    }
}
const startExampleBtn = () => {
    document.querySelector(".example-btn").addEventListener("click", async () => {
        const exampleContainer = document.querySelector(".example-container");
        const exampleContent = document.querySelector(".example-content");
        if(!!exampleContent.children.length){
            exampleContainer.classList.remove("hide");
        }else{
            const examples = await getLists();
            await renderExamples(examples);
            exampleContainer.classList.add("reveal");
        }
    });
    document.querySelector(".example-close-btn").addEventListener("click", () => {
        const exampleContainer = document.querySelector(".example-container");
        exampleContainer.classList.add("hide");
    })
}
startExampleBtn();